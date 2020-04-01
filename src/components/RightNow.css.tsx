import { css } from'@emotion/core';

export const global = css`
  body {
    background-color: hotpink;
    width:100% !important;
  }
`;

export const global2 = css`
  body {
    background-color: #79bdb4;
  }
`;

export const background = css`

    h1 {
        padding-top: 15vh;
        display: block;
        margin-right: auto;
        margin-left: auto;
        text-align: center;
        font-size: 20px;    
    }

    img {
        max-width:800px;
        margin-left: auto;
        margin-right: auto;
        display: inherit;
    }
`;

export const container = css`
    max-width: 1200px;
    margin-right: auto;
    margin-left: auto;
`;

export const img = css`
        width: 100%;
`;


export const headings = css`
    text-align: center;
    color: #f73749;
`;

export const bordersContainer = css`
    border-color: black;
    border-style: solid;
    border-width: 2px;
    padding-left: 5px;
    margin-bottom: 10px;
`;

export const orange = css`
    color: blue;
`;

export const green = css`
    color: green;
`;

export const red = css`
    color: red;
`;

export const inline = css`
    display: inline-block;
    padding-right: 5px;
    margin: 0;
`;

export const moreBottom = css`
    margin-bottom: 70px;
`;

export const headingContainer = css`
    text-align: center;
    background-color: #ffb839;
    >h1{
        margin-top: 0;
    }
    
`;

export const headingContainerBottom = css`
    text-align: center;
    background-color: #ffb839;
`;


export const width = css`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
`;