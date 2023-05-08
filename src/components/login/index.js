import React, {useState, useEffect} from "react";
import './index.css';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox, MDBAccordion
}
    from 'mdb-react-ui-kit';

function Login() {
    const [roomName, setRoomName] = useState("");
    const [socket, setSocket] = useState(null);
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    // Khi component được tạo, thiết lập kết nối WebSocket
    useEffect(() => {
        const newSocket = new WebSocket("ws://140.238.54.136:8080/chat/chat");

        newSocket.addEventListener("open", (event) => {
            console.log("Kết nối WebSocket đã được thiết lập", event);
            setSocket(newSocket);
        });

        return () => {
            // Đóng kết nối WebSocket khi component bị hủy
            newSocket.close();
        };
    }, []);

    const handleRegister = () => {
        //Gửi yêu cầu đăng ký đến server WebSocket
        const requestData = {
            action: "onchat",
            data: {
                event: "LOGIN",
                data: {
                    user: user,
                    pass: pass,
                },
            },
        };
        socket.send(JSON.stringify(requestData));
    };

    //Sau khi đăng ký thành công, set socket và lưu trữ thông tin để đăng nhập
    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const responseData = JSON.parse(event.data);
                if (responseData && responseData.status === "success") {
                    // Đăng ký thành công
                    setIsLoginSuccess(true);

                    // Lưu trữ thông tin đăng nhập, ví dụ: lưu trữ token
                }
            };
        }
    }, [socket]);

    return (
        <MDBContainer fluid className='d-flex align-items-center justify-content-center'>
            <div className='mask gradient-custom-3'></div>
            <MDBCard className='m-5' style={{maxWidth: '600px'}}>
                <MDBCardBody className='px-5'>
                    <h2 className="text-uppercase text-center mb-5">Đăng nhập</h2>
                    <MDBInput wrapperClass='mb-4' label='Nhập tên người dùng' size='lg' id='form1' type='text'
                              value={user}
                              onChange={(e) => setUser(e.target.value)}
                              />
                    {/*<MDBInput wrapperClass='mb-4' label='Nhập email của bạn' size='lg' id='form2' type='email'*/}
                    {/*          value={email}*/}
                    {/*          onChange={(e) => setUser(e.target.value)}*/}
                    {/*          placeholder="Nhập email của bạn"*/}
                    {/*/>*/}
                    <MDBInput wrapperClass='mb-4' label='Nhập mật khẩu của bạn' size='lg' id='form3' type='password'
                              value={pass}
                              onChange={(e) => setPass(e.target.value)}
                              />
                    <div className='d-flex flex-row justify-content-center mb-4'>
                        <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='Nhớ tài khoản'/>
                    </div>
                    <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' onClick={handleRegister}>Đăng nhập</MDBBtn>
                    <p>Bạn chưa có tài khoản? <a href="#!">Đăng ký</a></p>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
}

export default Login;