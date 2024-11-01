import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';

function Editzodiac() {
    const { id } = useParams(); // รับ ID จาก URL
    const navigate = useNavigate(); // ใช้ navigate เพื่อเปลี่ยนหน้าแทนการ reload

    const [Zodiac_ID, setZodiacID] = useState(''); 
    const [Zodiac_Name, setZodiacName] = useState('');
    const [Zodiac_Detail, setZodiacDetail] = useState('');
    const [Zodiac_WorkTopic, setZodiacWorkTopic] = useState('');
    const [Zodiac_FinanceTopic, setZodiacFinanceTopic] = useState('');
    const [Zodiac_LoveTopic, setZodiacLoveTopic] = useState('');
    const [Zodiac_Score, setZodiacScore] = useState('');
    const [Zodiac_ImageFile, setZodiacImageFile] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // State สำหรับเก็บไฟล์ใหม่ที่ถูกเลือก

    const fetchzodiac = async () => {
        try {
            const token = localStorage.getItem("authToken"); // ดึง Token จาก localStorage
    
            // ส่งคำขอ GET พร้อม Header Token
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/get-zodiac/${id}`, {
                headers: {
                    'x-access-token': token // เพิ่ม Token ใน Header
                }
            });
    
            const data = response.data;
            setZodiacID(data.Zodiac_ID); // ตั้งค่า Zodiac ID
            setZodiacName(data.Zodiac_Name);
            setZodiacDetail(data.Zodiac_Detail);
            setZodiacWorkTopic(data.Zodiac_WorkTopic);
            setZodiacFinanceTopic(data.Zodiac_FinanceTopic);
            setZodiacLoveTopic(data.Zodiac_LoveTopic);
            setZodiacScore(data.Zodiac_Score);
            setZodiacImageFile(data.Zodiac_ImageFile);
        } catch (error) {
            setError("Error fetching zodiac data.");
            console.error("Error fetching zodiac:", error);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchzodiac();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // ดึงไฟล์ที่เลือก
        if (file) {
            setSelectedFile(file); // แสดงชื่อไฟล์ที่เลือก
        }
    };

    const handleScoreChange = (e) => {
        const value = e.target.value;
        // ตรวจสอบว่าเป็นค่าตัวเลขและไม่เกิน 100
        if (value >= 0 && value <= 100) {
            setZodiacScore(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        const updatedZodiac = {
            Zodiac_Name,
            Zodiac_Detail,
            Zodiac_WorkTopic,
            Zodiac_FinanceTopic,
            Zodiac_LoveTopic,
            Zodiac_Score,
        };

        try {
            // Step 1: Update Zodiac information
            const updateResponse = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/update-zodiac/${id}`, updatedZodiac, {
                headers: {
                    'x-access-token': token
                }
            });

            if (updateResponse.data.status !== true) {
                throw new Error("ไม่สามารถอัพเดทข้อมูลราศีได้.");
            }

            // Step 2: Handle image upload if a new file is selected
            if (selectedFile) {
                const formData = new FormData();
                formData.append('Zodiac_Image', selectedFile);

                const putImageResponse = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/update-Zodiac-image/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-access-token': token
                    },
                });

                if (putImageResponse.data.status === true) {
                    const deleteData = { imagePath: Zodiac_ImageFile };
                    try {
                        const deleteResponse = await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/delete-zodiac-image/${id}`, {
                            data: deleteData,
                            headers: {
                                'x-access-token': token
                            }
                        });

                        if (deleteResponse.data.status !== true) {
                            throw new Error("ไม่สามารถลบภาพเก่าได้.");
                        }
                    } catch (deleteError) {
                        console.error("Error deleting old image:", deleteError);
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
            navigate(`/zodiac`);
        } catch (error) {
            console.error("Error updating zodiac:", error);
            setError(error.message || "Error updating zodiac data.");
        }
    };
    
    

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-4">
                <i 
                    className="bi bi-arrow-left ms-2" 
                    style={{ fontSize: '1.5rem', cursor: 'pointer' }} 
                    onClick={() => navigate(-1)} // ย้อนกลับไปหน้าก่อน
                ></i>
                <h1 className="text-center ms-5">แก้ไขข้อมูลราศี</h1>
            </div>
            {loading ? (
                <p>กำลังโหลดข้อมูล...</p>
            ) : (
                <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
                    <form onSubmit={handleSubmit}>
                        {/* เพิ่มฟิลด์ Zodiac ID */}
                        <div className="mb-3">
                            <label className="form-label" name="zodiacID">Zodiac ID</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Zodiac_ID"
                                value={Zodiac_ID} 
                                style={{ backgroundColor: '#e9ecef', color: '#495057' }}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" name="zodiacName">Zodiac Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Zodiac_Name"
                                value={Zodiac_Name}
                                onChange={(e) => setZodiacName(e.target.value)}
                                style={{ backgroundColor: '#e9ecef', color: '#495057' }}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" name="zodiacDetail">Zodiac Detail</label>
                            <textarea
                                className="form-control"
                                name="Zodiac_Detail"
                                value={Zodiac_Detail}
                                onChange={(e) => setZodiacDetail(e.target.value)}
                                style={{ backgroundColor: '#e9ecef', color: '#495057' }}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" name="zodiacWorkTopic">Work Topic</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Zodiac_WorkTopic"
                                value={Zodiac_WorkTopic}
                                onChange={(e) => setZodiacWorkTopic(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" name="zodiacFinanceTopic">Finance Topic</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Zodiac_FinanceTopic"
                                value={Zodiac_FinanceTopic}
                                onChange={(e) => setZodiacFinanceTopic(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" name="zodiacLoveTopic">Love Topic</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Zodiac_LoveTopic"
                                value={Zodiac_LoveTopic}
                                onChange={(e) => setZodiacLoveTopic(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" name="zodiacScore">Zodiac Score</label>
                            <input
                                type="number"
                                className="form-control"
                                name="Zodiac_Score"
                                value={Zodiac_Score}
                                onChange={handleScoreChange} // ใช้ handleScoreChange แทน
                                required
                                max="101" // จำกัดค่าไม่เกิน 100
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" name="zodiacImageFile">Image File</label>
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    name="Zodiac_ImageFile"
                                    value={Zodiac_ImageFile}
                                    readOnly
                                    placeholder="เลือกรูปภาพ..."
                                />
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*" // จำกัดประเภทไฟล์ให้เลือกเฉพาะภาพ
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" name="saveButton">บันทึกการเปลี่ยนแปลง</button>
                    </form>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">บันทึกข้อมูลเรียบร้อยแล้ว</div>}
                </div>
            )}
        </div>
    );
}

export default Editzodiac;
