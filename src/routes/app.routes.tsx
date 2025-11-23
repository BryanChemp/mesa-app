import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import { Menu } from '../features/app/Menu/Menu.feature'
import { Mesa } from '../features/app/Mesa/Mesa.feature'


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Container>
        <Menu />
        <Routes>
          <Route path="/" element={<Mesa />} />
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