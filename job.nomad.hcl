job "harmony" {
  type = "service"

  group "harmony" {
    task "harmony" {
      driver = "docker"

      config {
        image = var.image_tag
      }

      template {
        data        = <<ENV
{{ with nomadVar "nomad/jobs/harmony" }}
DATABASE_URL=postgres://harmony:{{ .db_password }}@postgres.dsekt.internal:5432/harmony
DISCORD_BOT_TOKEN={{ .bot_token }}
DISCORD_LIGHT_BOT_TOKEN={{ .light_bot_token }}
DEEPL_API_KEY={{ .deepl_api_key }}

SPAM_API_TOKEN={{ .spam_api_token }}
{{ end }}

NODE_ENV=production
ENV
        destination = "local/.env"
        env         = true
      }
    }
  }
}

variable "image_tag" {
  type = string
  default = "ghcr.io/datasektionen/harmony:latest"
}
