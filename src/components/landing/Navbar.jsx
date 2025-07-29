// src/components/landing/Navbar.jsx
import {
  Box,
  Flex,
  Link,
  IconButton,
  Collapse,
  VStack,
  useDisclosure,
  useBreakpointValue,
  Image,
} from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons"
import logo from "../../assets/imagenes/EUrbanalogo.png"

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, md: false })

  // tamaños en rem según breakpoint
  const logoSize = useBreakpointValue({ base: "2rem", md: "2.5rem" })
  const iconSize = useBreakpointValue({ base: "1rem", md: "1.5rem" })

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Contacto", href: "/contacto" },
    { label: "Iniciar sesión", href: "/login", variant: "solid" },
  ]

  return (
    <Box
      as="nav"
      bg="white"
      px={{ base: "1rem", md: "2rem" }}
      py={{ base: "0.75rem", md: "1rem" }}
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex align="center" justify="space-between" maxW="60rem" mx="auto">
        {/* Logo */}
        <Link href="/">
          <Image
            src={logo}
            alt="E-Urbana Logo"
            boxSize={logoSize}
          />
        </Link>

        {/* Desktop Links */}
        {!isMobile && (
          <Flex align="center" gap={{ base: "0.5rem", md: "1rem" }}>
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                px={{ base: "0.5rem", md: "0.75rem" }}
                py={{ base: "0.25rem", md: "0.5rem" }}
                fontSize={{ base: "0.875rem", md: "1rem" }}
                fontWeight={link.variant === "solid" ? "bold" : "medium"}
                color={link.variant === "solid" ? "brand.500" : "gray.600"}
                _hover={{
                  textDecor: "none",
                  color: link.variant === "solid"
                    ? "brand.600"
                    : "brand.500",
                }}
              >
                {link.label}
              </Link>
            ))}
          </Flex>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <IconButton
            onClick={onToggle}
            aria-label="Toggle menu"
            variant="ghost"
            icon={
              isOpen ? (
                <CloseIcon boxSize={iconSize} />
              ) : (
                <HamburgerIcon boxSize={iconSize} />
              )
            }
          />
        )}
      </Flex>

      {/* Mobile menu */}
      {isMobile && (
        <Collapse in={isOpen} animateOpacity>
          <VStack
            as="ul"
            spacing={{ base: "0.5rem", md: "1rem" }}
            mt="1rem"
            align="stretch"
            borderTop="1px"
            borderColor="gray.200"
            pt="1rem"
          >
            {links.map((link) => (
              <Box as="li" key={link.label}>
                <Link
                  href={link.href}
                  display="block"
                  px="1rem"
                  py="0.5rem"
                  fontSize="1rem"
                  fontWeight={link.variant === "solid" ? "bold" : "medium"}
                  color={link.variant === "solid" ? "brand.500" : "gray.700"}
                  _hover={{
                    textDecor: "none",
                    bg: "gray.100",
                    color:
                      link.variant === "solid" ? "brand.600" : "brand.500",
                  }}
                >
                  {link.label}
                </Link>
              </Box>
            ))}
          </VStack>
        </Collapse>
      )}
    </Box>
  )
}

export default Navbar
