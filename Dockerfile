FROM node:20.9.0

# Tạo thư mục làm việc trong container
WORKDIR /sgroup/backend

# Sao chép package.json và package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3000 để ứng dụng có thể truy cập từ bên ngoài container
EXPOSE 3000

# Chạy lệnh để start ứng dụng
CMD ["npm", "start"]