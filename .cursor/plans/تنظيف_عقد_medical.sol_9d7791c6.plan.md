---
name: تنظيف عقد Medical.sol
overview: إزالة جميع الدوال والبيانات المتعلقة بالأدوية والوصفات الطبية والطلبات من العقد، مع الحفاظ على جميع الوظائف الأساسية (الأطباء، المرضى، المواعيد، الدردشة، الإشعارات).
todos:
  - id: remove_structs
    content: إزالة structs غير المستخدمة (Medicine, Prescription, Order) وتعديل Patient struct
    status: completed
  - id: remove_mappings
    content: إزالة mappings المتعلقة بالأدوية والوصفات والطلبات
    status: completed
  - id: remove_state_vars
    content: إزالة state variables المتعلقة بالأدوية والوصفات
    status: completed
  - id: remove_events
    content: إزالة events المتعلقة بالأدوية والوصفات
    status: completed
  - id: remove_medicine_functions
    content: إزالة جميع دوال إدارة الأدوية (ADD, UPDATE, BUY, GET)
    status: completed
  - id: remove_prescription_functions
    content: إزالة جميع دوال الوصفات الطبية (PRESCRIBE, GET)
    status: completed
  - id: remove_order_functions
    content: إزالة دوال الطلبات (GET_ALL_PATIENT_ORDERS, GET_BOUGHT_MEDICINE)
    status: completed
  - id: verify_compilation
    content: التحقق من أن العقد يترجم بدون أخطاء
    status: completed
    dependencies:
      - remove_structs
      - remove_mappings
      - remove_state_vars
      - remove_events
      - remove_medicine_functions
      - remove_prescription_functions
      - remove_order_functions
---

# خطة تنظيف عقد Medical.sol

## الهدف

إزالة جميع الدوال والبيانات المتعلقة بالأدوية والوصفات الطبية والطلبات من العقد، مع التأكد من أن الموقع يعمل بشكل صحيح.

## التغييرات المطلوبة

### 1. إزالة Structs غير المستخدمة

- إزالة `Medicine` struct (السطر 6-14)
- إزالة `Prescription` struct (السطر 33-39)
- إزالة `Order` struct (السطر 77-84)
- تعديل `Patient` struct لإزالة `boughtMedicines` (السطر 30)

### 2. إزالة Mappings غير المستخدمة

- إزالة `mapping(uint => Medicine) public medicines` (السطر 101)
- إزالة `mapping(uint => Prescription) public prescriptions` (السطر 104)
- إزالة `mapping(uint => Order[]) public patientOrders` (السطر 100)

### 3. إزالة State Variables غير المستخدمة

- إزالة `uint public medicineCount` (السطر 110)
- إزالة `uint public prescriptionCount` (السطر 113)

### 4. إزالة Events المتعلقة بالأدوية والوصفات

- إزالة جميع أحداث MEDICINE_* (السطور 123-130)
- إزالة حدث MEDICINE_PRESCRIBED (السطر 143)

### 5. إزالة Functions المتعلقة بالأدوية

- إزالة `ADD_MEDICINE` (السطر 182-189)
- إزالة `UPDATE_MEDICINE_LOCATION` (السطر 192-199)
- إزالة `UPDATE_MEDICINE_PRICE` (السطر 202-209)
- إزالة `UPDATE_MEDICINE_QUANTITY` (السطر 212-219)
- إزالة `UPDATE_MEDICINE_DISCOUNT` (السطر 222-229)
- إزالة `UPDATE_MEDICINE_ACTIVE` (السطر 232-239)
- إزالة `BUY_MEDICINE` (السطر 400-427)
- إزالة `GET_ALL_REGISTERED_MEDICINES` (السطر 665-673)
- إزالة `GET_MEDICINE_DETAILS` (السطر 675-677)

### 6. إزالة Functions المتعلقة بالوصفات الطبية

- إزالة `PRESCRIBE_MEDICINE` (السطر 304-316)
- إزالة `GET_PRESCRIPTION_DETAILS` (السطر 471-473)
- إزالة `GET_ALL_PRESCRIBED_MEDICINES` (السطر 477-485)
- إزالة `GET_ALL_PRESCRIBED_MEDICINES_OF_PATIENT` (السطر 487-504)

### 7. إزالة Functions المتعلقة بالطلبات

- إزالة `GET_ALL_PATIENT_ORDERS` (السطر 465-468)
- إزالة `GET_BOUGHT_MEDICINE_BY_PAITENT` (السطر 562-565)

### 8. تنظيف الكود

- إزالة التعليقات المتعلقة بالأدوية والوصفات
- التأكد من أن جميع الدوال المتبقية تعمل بشكل صحيح

## الملفات المتأثرة

- `contracts/Medical.sol` - الملف الرئيسي الذي سيتم تنظيفه

## التحقق

- التأكد من أن العقد يترجم بدون أخطاء
- التأكد من أن جميع الدوال الأساسية (الأطباء، المرضى، المواعيد، الدردشة) تعمل بشكل صحيح
- التأكد من عدم وجود مراجع للدوال المحذوفة في الكود