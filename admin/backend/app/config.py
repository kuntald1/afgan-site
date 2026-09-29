from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://ace_admin:changeme@admin_db:5432/ace_admin_db"
    jwt_secret: str = "CHANGE_ME_BEFORE_DEPLOYING"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 720
    admin_username: str = "admin"
    admin_password: str = "changeme123"
    cors_origins: str = "http://localhost:5174,http://localhost:5173"

    # AI-powered CV matching — see admin/README.md "AI-powered CV matching"
    # for what these enable and how to set them up. If either is left
    # blank, the feature degrades gracefully: uploads still work, the free
    # keyword search still works, only the "AI extraction" and "smart
    # search" features are unavailable (with a clear error, not a crash).
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-5"
    voyage_api_key: str = ""
    voyage_model: str = "voyage-4-lite"
    voyage_embedding_dimensions: int = 1024

    class Config:
        env_file = ".env"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
