FROM python:3.10-alpine
WORKDIR /app
ENV TZ=Asia/Shanghai
RUN apk add --no-cache tzdata gcc musl-dev postgresql-dev && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app
EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
