import React, {useState, useEffect} from "react";
import './index.css';
import { useHistory, Link } from 'react-router-dom';
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
    // const [roomName, setRoomName] = useState("");
    const [socket, setSocket] = useState(null);
    const [userList, setUserList] = useState([]);
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const history = useHistory();

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

    const handleGetUserList = () => {
        // Gửi yêu cầu lấy danh sách user tới WebSocket Server
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
        const loginData = {
            action: 'onchat',
            data: {
                event: 'GET_USER_LIST',
            },
        };
        socket.send(JSON.stringify(loginData));
        console.log("Đã gửi yêu cầu lấy danh sách cho server")
        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.status === 'success' && response.event === 'GET_USER_LIST') {
                const users = response.data;
                setUserList(users);
                history.push('/home', {userList : users})
            }
        }
    }

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const responseData = JSON.parse(event.data);
                // eslint-disable-next-line react-hooks/rules-of-hooks
                if (responseData.action === "onchat" && responseData.data.event === "success") {
                    // Đăng nhập thành công
                }
            };
        }
    }, [socket]);
    // const handleLogin = () => {
    //     //Gửi yêu cầu đăng nhập đến server WebSocket
    //     // eslint-disable-next-line react-hooks/rules-of-hooks
    //     const requestData = {
    //         action: "onchat",
    //         data: {
    //             event: "LOGIN",
    //             data: {
    //                 user: user,
    //                 pass: pass,
    //             },
    //         },
    //     };
    //     socket.send(JSON.stringify(requestData));
    //
    // };
    //
    // //Sau khi đăng ký thành công, set socket và lưu trữ thông tin để đăng nhập
    // useEffect(() => {
    //     if (socket) {
    //         socket.onmessage = (event) => {
    //             const responseData = JSON.parse(event.data);
    //             // eslint-disable-next-line react-hooks/rules-of-hooks
    //             if (responseData && responseData.status === "success") {
    //                 // Đăng nhập thành công
    //                 setIsLoginSuccess(true);
    //                 // Lưu trữ thông tin đăng nhập, ví dụ: lưu trữ token
    //                 history.push('/home');
    //                 // window.location.href = '/home';
    //             }
    //         };
    //     }
    // }, [socket]);

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
                    <MDBInput wrapperClass='mb-4' label='Nhập mật khẩu của bạn' size='lg' id='form3' type='password'
                              value={pass}
                              onChange={(e) => setPass(e.target.value)}
                    />
                    <div className='d-flex flex-row justify-content-center mb-4'>
                        <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='Nhớ tài khoản'/>
                    </div>
                    <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' onClick={handleGetUserList}>Đăng nhập</MDBBtn>
                    <p>Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>

    );
}

export default Login;