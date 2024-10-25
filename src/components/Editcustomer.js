import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';

function EditCustomer() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [Users_ID, setUserID] = useState('');
    const [Users_Username, setUsername] = useState('');
    const [Users_DisplayName, setDisplayName] = useState('');
    const [Users_FirstName, setFirstName] = useState('');
    const [Users_LastName, setLastName] = useState('');
    const [Users_Email, setEmail] = useState('');
    const [Users_Phone, setPhone] = useState('');
    const [Users_BirthDate, setBirthDate] = useState('');
    const [Users_RegisDate, setRegisDate] = useState('');
    const [Users_ImageFile, setImageFile] = useState('');
    const [Users_Google_Uid, setGoogle_Uid] = useState('');
    const [UsersGender_ID, setGender_ID] = useState('');
    const [RegisType_Name, setRegisType_Name] = useState('');
    const [UsersType_Name, setUsersType_Name] = useState('');
    const [Users_IsActive, setIsActive] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [phoneError, setPhoneError] = useState('');

    const fetchCustomer = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/get-profile/${id}`);
            const data = response.data;
            setUserID(data.Users_ID || '');
            setUsername(data.Users_Username || '');
            setDisplayName(data.Users_DisplayName || '');
            setFirstName(data.Users_FirstName || '');
            setLastName(data.Users_LastName || '');
            setEmail(data.Users_Email || '');
            setPhone(data.Users_Phone || '');
            setBirthDate(data.Users_BirthDate ? data.Users_BirthDate.split('T')[0] : '');
            setRegisDate(data.Users_RegisDate ? data.Users_RegisDate.split('T')[0] : '')
            setImageFile(data.Users_ImageFile || '');
            setGoogle_Uid(data.Users_Google_Uid || '');
            setGender_ID(data.UsersGender_ID || '');
            setRegisType_Name(data.RegisType_Name || '');
            setUsersType_Name(data.UsersType_Name || '');
            setIsActive(data.Users_IsActive || '');
        } catch (error) {
            setError("Error fetching customer data.");
            console.error("Error fetching customer:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setPhone(value);
            setPhoneError('');
        } else {
            setPhoneError('หมายเลขโทรศัพท์ต้องเป็นตัวเลข 10 หลัก');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Users_Phone.length !== 10) {
            setPhoneError('หมายเลขโทรศัพท์ต้องเป็น 10 หลัก');
            return;
        }
        const formattedBirthDate = Users_BirthDate ? new Date(Users_BirthDate).toISOString().split('T')[0] : '';

        const updatedCustomer = {
            Users_ID,
            Users_Username,
            Users_DisplayName,
            Users_FirstName,
            Users_LastName,
            Users_Email,
            Users_Phone,
            Users_BirthDate,
            Users_RegisDate,
            Users_ImageFile,
            Users_Google_Uid,
            UsersGender_ID,
            RegisType_Name,
            UsersType_Name,
            Users_IsActive
        };

        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}/api/update-profile-web/${id}`, updatedCustomer);
            
            if (selectedFile) {
                const formData = new FormData();
                formData.append('Profile_Image', selectedFile);

                const putImageResponse = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/update-profile-image/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (putImageResponse.data.status === true) {
                    const deleteData = { imagePath: Users_ImageFile };
                    try {
                        await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/delete-profile-image/${id}`, { data: deleteData });
                    } catch (deleteError) {
                        console.error("Error deleting image:", deleteError.response?.data || deleteError.message);
                        setError("ไม่สามารถลบภาพเก่าได้.");
                        return;
                    }
                } else {
                    setError("ไม่สามารถอัปโหลดภาพใหม่ได้.");
                    return;
                }
            }

            setSuccess(true);
            alert('บันทึกข้อมูลเรียบร้อยแล้ว');
            navigate('/customer');
        } catch (error) {
            setError("Error updating customer data.");
            console.error("Error updating customer:", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-4">
                <i 
                    className="bi bi-arrow-left ms-2" 
                    style={{ fontSize: '1.5rem', cursor: 'pointer' }} 
                    onClick={() => navigate(-1)}
                ></i>
                <h1 className="text-center ms-5">{loading ? "กำลังโหลดข้อมูล..." : "แก้ไขข้อมูลผู้ใช้"}</h1>
            </div>
            {loading ? (
                <p>กำลังโหลดข้อมูล...</p>
            ) : (
                <div style={{ height: '80vh', overflowY: 'auto' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">User ID</label>
                            <input
                                type="text"
                                className="form-control"
                                value={Users_ID}
                                onChange={(e) => setUserID(e.target.value)}
                                required
                                readOnly
                                style={{ backgroundColor: '#e9ecef', color: '#495057' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={Users_Username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                readOnly
                                style={{ backgroundColor: '#e9ecef', color: '#495057' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Display Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={Users_DisplayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={Users_FirstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={Users_LastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={Users_Email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                readOnly
                                style={{ backgroundColor: '#e9ecef', color: '#495057' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                value={Users_Phone}
                                onChange={handlePhoneChange}
                                required
                            />
                            {phoneError && <small className="text-danger">{phoneError}</small>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Birth Date</label>
                            <input
                                type="text"
                                className="form-control"
                                value={Users_BirthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                readOnly
                                style={{ backgroundColor: '#e9ecef', color: '#495057' }}

                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Registration Date</label>
                            <input
                                type="text"
                                className="form-control"
                                value={Users_RegisDate}
                                readOnly
                                style={{ backgroundColor: '#e9ecef', color: '#495057' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Image</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Google UID</label>
                            <input
                                type="text"
                                className="form-control"
                                value={Users_Google_Uid}
                                onChange={(e) => setGoogle_Uid(e.target.value)}
                                required
                                readOnly
                                style={{ backgroundColor: '#e9ecef', color: '#495057' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Gender</label>
                            <select
                                className="form-select"
                                name="UsersGender_ID"
                                value={UsersGender_ID} // ใช้ค่า UsersGender_ID เพื่อให้ dropdown แสดงค่าที่ถูกเลือก
                                onChange={(e) => setGender_ID(e.target.value)} // อัปเดต state เมื่อมีการเลือกใหม่
                                required
                            >
                                <option value=''>เลือกเพศ</option> {/* ตัวเลือกว่าง */}
                                <option value="1">MALE</option>
                                <option value="2">FEMALE</option>
                                <option value="3">OTHER</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Registration Type</label>
                            <input
                                type="text"
                                className="form-control"
                                value={RegisType_Name}
                                onChange={(e) => setRegisType_Name(e.target.value)}
                                readOnly
                                style={{ backgroundColor: '#e9ecef', color: '#495057' }}

                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">User Type</label>
                            <input
                                type="text"
                                className="form-control"
                                value={UsersType_Name}
                                onChange={(e) => setUsersType_Name(e.target.value)}
                                readOnly
                                style={{ backgroundColor: '#e9ecef', color: '#495057' }}

                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Is Active</label>
                            <select
                                className="form-select"
                                value={Users_IsActive}
                                onChange={(e) => setIsActive(e.target.value)}
                                required
                            >
                                <option value="0">Suspended</option>
                                <option value="1">Active</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">บันทึกการเปลี่ยนแปลง</button>
                        {error && <p className="text-danger">{error}</p>}
                        {success && <p className="text-success">Customer updated successfully!</p>}
                    </form>
                </div>
            )}
        </div>
    );
}

export default EditCustomer;
