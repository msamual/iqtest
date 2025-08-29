# GitHub Actions Setup

## Self-Hosted Runner

Этот проект использует self-hosted runner, который уже запущен на вашем сервере.

### Преимущества self-hosted runner:
- ✅ Не нужны секреты в GitHub
- ✅ Прямой доступ к серверу
- ✅ Быстрее развертывание
- ✅ Безопаснее

## Настройка сервера

### 1. Подготовка проекта
```bash
# На сервере создайте папку для проекта
mkdir -p /root/iqtest
cd /root/iqtest

# Клонируйте репозиторий
git clone https://github.com/msamual/iqtest.git .

# Убедитесь, что SSL сертификаты на месте
ls -la /etc/ssl/certs/msamual.ru.crt
ls -la /etc/ssl/certs/Certificate.key
```

### 2. Настройка Docker
```bash
# На сервере установите Docker и Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установите Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Workflow файлы

### `.github/workflows/test.yml`
- Запускается при push в main/develop и при pull requests
- Проверяет корректность docker-compose.yml
- Тестирует сборку Docker образов

### `.github/workflows/deploy.yml`
- Запускается при push в main
- Работает на self-hosted runner
- Просто запускает скрипт `deploy.sh`

## Локальная разработка

```bash
# Развертывание локально
./deploy.sh

# Тестирование
./test.sh

# Стандартные команды Docker Compose
docker-compose up --build -d
docker-compose ps
docker-compose logs
```

## Мониторинг

После настройки GitHub Actions:
1. Перейдите в раздел "Actions" в GitHub
2. Увидите статус последних запусков
3. Можете запустить развертывание вручную через "Run workflow"

## Troubleshooting

### Self-hosted runner не работает
```bash
# Проверьте статус runner'а
sudo systemctl status actions.runner.*

# Перезапустите runner
sudo systemctl restart actions.runner.*

# Проверьте логи
sudo journalctl -u actions.runner.* -f
```

### Docker permission denied
```bash
# Запустите скрипт настройки прав (как root)
sudo ./setup-runner-permissions.sh

# Или вручную:
# Проверьте права на Docker socket
ls -la /var/run/docker.sock

# Добавьте пользователя runner в группу docker
sudo usermod -aG docker runner

# Установите права на Docker socket
sudo chmod 666 /var/run/docker.sock

# Перезапустите runner после изменения групп
sudo systemctl restart actions.runner.*
```

### Docker образы не собираются
```bash
# Проверьте Dockerfile
sudo docker build -t test ./IqTestApi -f ./IqTestApi/Dockerfile.prod
```

### SSL сертификаты не найдены
```bash
# Проверьте пути к сертификатам
ls -la /etc/ssl/certs/msamual.ru.crt
ls -la /etc/ssl/certs/Certificate.key
```

### Картинки не отображаются
```bash
# Запустите диагностику картинок
./test-images-debug.sh

# Проверьте, есть ли картинки в контейнере API
docker-compose exec iq-test-api ls -la /app/wwwroot/images/

# Проверьте конфигурацию Nginx
docker-compose exec iq-test-frontend cat /etc/nginx/conf.d/default.conf
```
