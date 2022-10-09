import styled, { css } from "styled-components";

const containerStyles = css`
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 10px 15px;
  width: 100%;
`;

const Button = styled.button`
  color: #008064;
  padding: 0.5em 1em;
  border: 2px solid #008064;
  border-radius: 4px;
  background-color: #fff;
  ${(props) =>
    props.primary &&
    css`
      background-color: #008064;
      color: white;
    `}
`;

const Title = styled.div`
  color: rgba(0, 0, 0, 0.5);
  ${containerStyles}
  ${(props) =>
    props.rounded &&
    css`
      border-radius: 30px;
    `}
`;

const Input = styled.input`
  ${containerStyles}
  ${(props) =>
    props.rounded &&
    css`
      border-radius: 30px;
    `}
`;

const Select = styled.select`
  ${containerStyles}
  ${(props) =>
    props.rounded &&
    css`
      border-radius: 30px;
    `}
`;

export { Button, Title, Input, Select };
