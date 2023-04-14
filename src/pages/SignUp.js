import React, { useState } from 'react'
import { Container,Col,Row, } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link,useNavigate } from 'react-router-dom';
import "./SignUp.css"
import ppic from '../assets/sign.png'
import {useSignupUserMutation}  from '../services/appApi'



function SignUp() {
    const [email,setEmail]= useState('');
    const [password,setPassword]= useState('');
    const navigate = useNavigate();
    const [name,setName]= useState('');
    const [ signupUser,{ isLoading , error }] =useSignupUserMutation();
    
//Image Upload
const  [image, setImage]=useState(null)
const [uploadingImg,setUploadingImg]=useState(false)
const [imagePreview,setImagePreview]=useState(null)
  
function validateImg(e){
    const file = e.target.files[0];
   if(file.size>=2097152){
      return alert('Max file size is 2mb')
   }
   else{
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
   }
  }

async function uploadImage(){
    const data =new FormData();
    data.append('file',image);
    data.append('upload_preset','preset1');
    try {
        setUploadingImg(true)
        let res =await fetch('https://api.cloudinary.com/v1_1/dq1u0hfev/image/upload',{
         method:'post',
        body:data   
        })
       const urlData=await res.json()
       setUploadingImg(false)
       return urlData.url 
    }catch(error){
   setUploadingImg(false) 
   console.log(error)

}
}
  async function handleSignup(e){
    e.preventDefault();
    if(!image) return alert('Please Upload a profile picture');
   const url = await uploadImage(image);
   console.log(url);
   //signup the user
signupUser({name,email,password,picture:url}).then(({data})=>{
  if(data){
    console.log(data)
    navigate('/chat')
  }
})
}


return (
    <Container>
        <Row>
            <Col md={7} className="d-flex align-items-center justify-content-center ">
    <Form style={{width:"80%",maxWidth:500}} onSubmit={handleSignup}> 
    <h1 className='text-center'>Create Account</h1>
    <div className='signup-profile-pic__container'>
        <img src={imagePreview || ppic} className="signup-profile-pic" alt="" />
        <label htmlFor='image-upload' className='image-upload-label'>
            <i className='fas fa-plus-circle add-picture-icon'></i>
        </label>
        <input type="file" id='image-upload' hidden accept="image/png, image/jpeg" onChange={validateImg}/>

    </div>
    <Form.Group className="mb-3" controlId="formBasicName">
      <Form.Label>Name</Form.Label>
      <Form.Control type="text" placeholder="Enter Name" onChange={(e)=>setName(e.target.value)} value={name} />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" placeholder="Enter email" onChange={(e)=>setEmail(e.target.value)} value={email} />
      <Form.Text className="text-muted">
        We'll never share your email with anyone else.
      </Form.Text>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" autoComplete='on' placeholder="Password" onChange={(e)=>setPassword(e.target.value)} value={password} />
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicCheckbox">
      <Form.Check type="checkbox" label="Check me out" />
    </Form.Group>
    <Button variant="primary" type="submit">
      {uploadingImg ? 'Signing you up...':'Signup'}
    </Button>
    <div className='py-4'>
        <p className='text-center'>
        Already have an account? <Link to='/login'>Login</Link>
        </p>
    </div>
  </Form>
  </Col>
  <Col md={5} className="signup__bg"></Col>

  </Row>
</Container>
  )
}

export default SignUp
