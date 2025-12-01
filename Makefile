# Makefile para facilitar operações comuns do frontend

.PHONY: help install build serve docker-build docker-run deploy-aws

help:
	@echo "Comandos disponíveis:"
	@echo "  make install       - Instala dependências"
	@echo "  make build         - Build de produção"
	@echo "  make serve         - Inicia servidor de desenvolvimento"
	@echo "  make docker-build  - Constrói imagem Docker"
	@echo "  make docker-run    - Executa container Docker"
	@echo "  make deploy-aws    - Faz deploy na AWS"

install:
	npm ci

build:
	npm run build:prod

serve:
	npm run start:proxy

docker-build:
	docker build -t away-frontend:latest .

docker-run:
	docker run -p 4200:80 away-frontend:latest

deploy-aws:
	./deploy-aws.sh

