import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

export const Menu: React.FC = () => {
    return (
        <MenuContainer>
            <LogoContainer>
                <h4>Mesa</h4>
            </LogoContainer>
            <Nav>
                <NavItem to="/">
                    <FontAwesomeIcon icon={faHome} color='black' fontSize={12} />
                    <NavLink >Mesa</NavLink>
                </NavItem>
            </Nav>
        </MenuContainer>
    )
}

const MenuContainer = styled.div`
    display: flex;
    flex-direction: row;
    display: flex;
    z-index: 10;
    width: 100%;
    padding: 16px 32px;
    gap: 32px;
`

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 32px;
        height: 32px;
    }
`

const Nav = styled.ul`
    list-style-type: none;
    display: flex;
    text-align: start;
    gap: 1.2rem;
    margin: 0;
    padding: 0;
`

const NavItem = styled(Link)`
    display: flex;
    gap: 8px;
    align-items: center;
    margin: 0;
    width: 100%;
    text-decoration: none;
    border-radius: 8px;
    transition: background 0.2s ease-in-out;
    padding: 8px;

    &:hover {
        cursor: pointer;
    }
`

const NavLink = styled.li`
  text-decoration: none;
  font-size: 0.8rem;
  border-radius: 5px;
  white-space: nowrap;
`