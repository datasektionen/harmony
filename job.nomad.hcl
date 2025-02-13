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

CODE_INTIS={{ .code_intis }}
CODE_A={{ .code_group_a }}
CODE_B={{ .code_group_b }}
CODE_C={{ .code_group_c }}
CODE_D={{ .code_group_d }}
CODE_E={{ .code_group_e }}
CODE_F={{ .code_group_f }}
CODE_G={{ .code_group_g }}
CODE_H={{ .code_group_h }}
CODE_I={{ .code_group_i }}
CODE_J={{ .code_group_j }}
CODE_K={{ .code_group_k }}
CODE_L={{ .code_group_l }}
CODE_M={{ .code_group_m }}

SPAM_API_TOKEN={{ .spam_api_token }}
{{ end }}
SPAM_URL=https://spam.datasektionen.se
DISCORD_VERIFIED_ROLE=verified
TOKEN_SIZE=8 # verify tokens sent via email
TOKEN_TIMEOUT=600000 # ms; 10 minutes

# not nomad vars because hopefully removed soon :), see #188
GROUP_A=Grupp A
GROUP_B=Grupp B
GROUP_C=Grupp C
GROUP_D=Grupp D
GROUP_E=Grupp E
GROUP_F=Grupp F
GROUP_G=Grupp G
GROUP_H=Grupp H
GROUP_I=Grupp I
GROUP_J=Grupp J
GROUP_K=Grupp K
GROUP_L=Grupp L
GROUP_M=Grupp M

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
