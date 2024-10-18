# **Veg Bags (Farm-to-Table Delivery Platform)**  

A **farm-to-table delivery platform** designed to streamline operations and enhance user experience. This platform integrates **order management, delivery tracking, and customer feedback**, ensuring scalability and reliability using modern deployment technologies.  

---

## **Table of Contents**  
1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Installation and Setup](#installation-and-setup)  
4. [Configuration](#configuration)  
5. [Usage](#usage)  
6. [Testing](#testing)  

---

## **Features**  
- **Order Management:** A user-friendly interface for placing and managing customer orders.  
- **Invoice Management:** A user-friendly interface for managing Invoices.  
- **Inventory Management:** A user-friendly interface for managing Item Inventory.  
- **Customer Feedback:** Collect and analyze customer reviews to improve service.  
- **Responsive and Intuitive UI:** Optimized for efficiency across desktop and mobile devices.  
- **Scalable Architecture:** Uses **AWS** for seamless cloud deployment and high availability.  

---

## **Tech Stack**  
- **Backend:** Python, Django  
- **Frontend:** JavaScript, React  
- **Cloud Services:** AWS EB, S3  
- **Database:** MySQL  
- **Authentication:** django-rest-knox

---

## **Installation and Setup**  
### Prerequisites  
- Python 3.x  
- Node.js and npm  
- MySQL  
- Redis server  
- AWS account for cloud services  

### Setup Instructions  
1. **Clone the repository:**  
   ```bash
   git clone <repository-url>  
   cd farm-to-table-platform  
   ```

2. **Create and activate a virtual environment:**  
   ```bash
   python -m venv venv  
   source venv/bin/activate  # For Linux/Mac  
   venv\Scripts\activate     # For Windows  
   ```

3. **Install backend dependencies:**  
   ```bash
   pip install -r requirements.txt  
   ```

4. **Install frontend dependencies:**  
   ```bash
   cd frontend  
   npm install  
   ```

5. **Configure the database and Redis server:**  
   - Update the `DATABASES` section in `settings.py`.  
   - Set up Redis in the Django settings for Django Channels.  

6. **Run migrations:**  
   ```bash
   python manage.py makemigrations  
   python manage.py migrate  
   ```

7. **Collect static files:**  
   ```bash
   python manage.py collectstatic  
   ```

8. **Run the Django server:**  
   ```bash
   python manage.py runserver  
   ```

## **Testing**  
Run the tests to verify all components:  
```bash
python manage.py test  
npm test  # For frontend tests  
```

---

## **Contact**  
For queries or support, reach out to:  
**Zaakir Hussain**  
Email: [mail.zaakir.hussain@gmail.com](mailto:mail.zaakir.hussain@gmail.com)  
