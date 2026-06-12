from contextlib import contextmanager

from fastapi.testclient import TestClient

from tests.conftest import auth_headers, signup_and_get_token


def test_chat_fallback_when_no_api_key(client: TestClient, monkeypatch) -> None:
    """Without ANTHROPIC_API_KEY, the chat streams the offline fallback."""
    from app.services import chat as chat_service

    monkeypatch.setattr(chat_service, "_get_client", lambda: None)
    token = signup_and_get_token(client)
    with client.stream(
        "POST",
        "/api/chat",
        json={"messages": [{"role": "user", "content": "Hi"}]},
        headers=auth_headers(token),
    ) as response:
        assert response.status_code == 200
        assert response.headers["content-type"].startswith("text/event-stream")
        body = "".join(chunk for chunk in response.iter_text())

    assert "data: " in body
    assert "Mama" in body  # patient first name from SIGNUP_PAYLOAD
    assert "offline" in body.lower()
    assert "[DONE]" in body


def test_chat_uses_real_client_when_available(client: TestClient, monkeypatch) -> None:
    """When _get_client returns an Anthropic-shaped client, we stream its text_stream."""
    from app.services import chat as chat_service

    class FakeStream:
        text_stream = ["Hello ", "Mama. ", "Eat ", "well."]

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            return False

    class FakeMessages:
        def stream(self, **kwargs):
            self.last_kwargs = kwargs
            return FakeStream()

    class FakeClient:
        def __init__(self):
            self.messages = FakeMessages()

    fake = FakeClient()
    monkeypatch.setattr(chat_service, "_get_client", lambda: fake)

    token = signup_and_get_token(client)
    with client.stream(
        "POST",
        "/api/chat",
        json={"messages": [{"role": "user", "content": "what should I eat?"}]},
        headers=auth_headers(token),
    ) as response:
        assert response.status_code == 200
        body = "".join(chunk for chunk in response.iter_text())

    assert "Hello" in body
    assert "Eat" in body
    assert "[DONE]" in body
    # System prompt was constructed and passed through
    assert fake.messages.last_kwargs["model"] == "claude-sonnet-4-6"
    assert fake.messages.last_kwargs["system"][0]["cache_control"] == {"type": "ephemeral"}


def test_chat_requires_auth(client: TestClient) -> None:
    response = client.post(
        "/api/chat", json={"messages": [{"role": "user", "content": "Hi"}]}
    )
    assert response.status_code == 401


_ = contextmanager  # silence lint
