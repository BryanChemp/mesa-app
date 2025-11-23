import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'

export default function AuthRoutes() {

  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route path="/" element={<></>} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`
