import styled from 'styled-components';

const ProfileWrapper = styled.div`
    display: flex;
    align-items:center;
    justify-content: center;
    /* height: 30rem; */
    background-color: var(--primary-50);
    border-radius: 10px;
    padding: 20px;
    .label-input-contianer>div{
        margin: 10px;
    }
    input{
        background-color: transparent;
        border: none;
        border-bottom: 1px solid black;
    }

`

export default ProfileWrapper