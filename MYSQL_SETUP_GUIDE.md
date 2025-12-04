# MySQL Setup Guide for Windows

This guide will help you install and configure MySQL on your Windows device.

## Option 1: MySQL Installer (Recommended for Windows)

### Step 1: Download MySQL Installer
1. Go to [MySQL Downloads](https://dev.mysql.com/downloads/installer/)
2. Download **MySQL Installer for Windows** (choose the web installer or full installer)
   - Web installer: Smaller download, downloads components during installation
   - Full installer: Larger download, includes all components

### Step 2: Install MySQL
1. Run the installer executable
2. Choose **"Developer Default"** or **"Server only"** setup type
3. Click **"Next"** and follow the installation wizard
4. When prompted, configure MySQL Server:
   - **Port**: 3306 (default)
   - **Root Password**: Set a strong password (remember this!)
   - **Windows Service**: Check "Start MySQL Server at System Startup"
   - **Windows Service Name**: MySQL80 (or MySQL)
5. Complete the installation

### Step 3: Verify Installation
1. Open **Command Prompt** or **PowerShell**
2. Navigate to MySQL bin directory (usually `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
3. Or add MySQL to your PATH environment variable
4. Test connection:
   ```bash
   mysql -u root -p
   ```
5. Enter your root password when prompted

### Step 4: Create Database for E-Voting Project
1. After logging into MySQL, run:
   ```sql
   CREATE DATABASE e_voting;
   ```
2. Verify database creation:
   ```sql
   SHOW DATABASES;
   ```
3. Exit MySQL:
   ```sql
   EXIT;
   ```

---

## Option 2: XAMPP (Easier Alternative)

XAMPP includes MySQL, Apache, PHP, and phpMyAdmin in one package.

### Step 1: Download XAMPP
1. Go to [XAMPP Downloads](https://www.apachefriends.org/download.html)
2. Download **XAMPP for Windows**
3. Run the installer

### Step 2: Install XAMPP
1. Choose installation directory (default: `C:\xampp`)
2. Select components: **MySQL** and **phpMyAdmin** (at minimum)
3. Complete installation

### Step 3: Start MySQL
1. Open **XAMPP Control Panel**
2. Click **"Start"** next to MySQL
3. MySQL will run on port **3306**

### Step 4: Create Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click **"New"** in the left sidebar
3. Database name: `e_voting`
4. Collation: `utf8mb4_unicode_ci`
5. Click **"Create"**

---

## Option 3: MySQL via Docker (Advanced)

If you have Docker installed:

```bash
docker run --name mysql-e-voting -e MYSQL_ROOT_PASSWORD=yourpassword -e MYSQL_DATABASE=e_voting -p 3306:3306 -d mysql:8.0
```

---

## Configure Environment Variables

After installing MySQL, update your `.env` file in the `backend` directory:

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/e_voting"
```

Replace `yourpassword` with the root password you set during installation.

---

## Troubleshooting

### MySQL Service Not Starting
1. Open **Services** (Win + R, type `services.msc`)
2. Find **MySQL80** or **MySQL**
3. Right-click → **Start**

### Port 3306 Already in Use
- Check if another MySQL instance is running
- Change MySQL port in `my.ini` configuration file
- Update `DATABASE_URL` accordingly

### Can't Connect to MySQL
- Verify MySQL service is running
- Check firewall settings
- Ensure username and password are correct
- Verify database name exists

### Reset Root Password
1. Stop MySQL service
2. Start MySQL with `--skip-grant-tables` option
3. Connect and update password:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
   FLUSH PRIVILEGES;
   ```

---

## Next Steps

After MySQL is installed and configured:

1. **Install Node.js dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

3. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

4. **Start the backend:**
   ```bash
   npm run dev
   ```

---

## System Requirements

- **OS**: Windows 10/11
- **RAM**: Minimum 2GB (4GB recommended)
- **Disk Space**: ~500MB for MySQL installation
- **Node.js**: Version 18.0.0 or higher

---

## Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Prisma MySQL Guide](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [XAMPP Documentation](https://www.apachefriends.org/docs/)

