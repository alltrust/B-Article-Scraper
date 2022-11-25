import styled from "styled-components";

const ScrapeFormWrapper = styled.section`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: s ;

    .articles-form{
       
        border:2px solid white;
        box-shadow: 5px;
        border-radius: 7px;
        /* background-color: red; */
        padding: 10px
    }
    .articles-input-container{
        display: flex;
        flex-direction: column;
    }
    .url-input{
        margin-bottom: 20px;
        min-height: 200px; 
        border: none;
    }
`

export default ScrapeFormWrapper