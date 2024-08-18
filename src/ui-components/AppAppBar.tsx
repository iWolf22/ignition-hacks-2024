import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import { PaletteMode } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";
import * as React from "react";

import ToggleColorMode from "./ToggleColorMode";

const logoStyle = {
    cursor: "pointer",
    height: "auto",
    width: "140px",
};

interface AppAppBarProps {
    mode: PaletteMode;
    setActivityState?: React.Dispatch<
        React.SetStateAction<"arm" | "hand" | "legs">
    >;
    toggleColorMode: () => void;
}

function AppAppBar({
    mode,
    setActivityState,
    toggleColorMode,
}: AppAppBarProps) {
    const [open, setOpen] = React.useState(false);
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUrl(window.location.href); // Get the full URL
        }
    }, []);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const scrollToSection = (sectionId: string) => {
        const sectionElement = document.getElementById(sectionId);
        const offset = 128;
        if (sectionElement) {
            const targetScroll = sectionElement.offsetTop - offset;
            sectionElement.scrollIntoView({ behavior: "smooth" });
            window.scrollTo({
                behavior: "smooth",
                top: targetScroll,
            });
            setOpen(false);
        }
    };

    const { data: session } = useSession();

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{
                    backgroundImage: "none",
                    bgcolor: "transparent",
                    boxShadow: 0,
                    mt: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        sx={(theme) => ({
                            alignItems: "center",
                            backdropFilter: "blur(24px)",
                            bgcolor:
                                theme.palette.mode === "light"
                                    ? "rgba(200, 255, 200, 0.4)" // Green tint for light mode
                                    : "rgba(0, 80, 0, 0.4)", // Darker green for dark mode
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: "999px",
                            boxShadow:
                                theme.palette.mode === "light"
                                    ? `0 0 1px rgba(0, 255, 0, 0.1), 1px 1.5px 2px -1px rgba(0, 255, 0, 0.15), 4px 4px 12px -2.5px rgba(0, 255, 0, 0.15)` // Green shadow
                                    : "0 0 1px rgba(0, 80, 0, 0.7), 1px 1.5px 2px -1px rgba(0, 80, 0, 0.65), 4px 4px 12px -2.5px rgba(0, 80, 0, 0.65)", // Dark green shadow
                            display: "flex",
                            flexShrink: 0,
                            justifyContent: "space-between",
                            maxHeight: 40,
                        })}
                        variant="regular"
                    >
                        <Box
                            sx={{
                                alignItems: "center",
                                display: "flex",
                                flexGrow: 1,
                                ml: "-18px",
                                px: 1,
                            }}
                        >
                            <img
                                alt="logo of sitemark"
                                src={
                                    "https://cdn.discordapp.com/attachments/1274426077795844176/1274439214582202388/heaiwfhweuf.png?ex=66c24182&is=66c0f002&hm=47ebc23678afbe6e28d9969be2db5b2cef9b965f65294d1a347dc8482f75a728&"
                                }
                                style={logoStyle}
                            />
                            <Box sx={{ display: { md: "flex", xs: "none" } }}>
                                {!url.includes("physiotherapy") ? (
                                    <>
                                        <MenuItem
                                            onClick={() =>
                                                scrollToSection("hero")
                                            }
                                            sx={{ px: "12px", py: "6px" }}
                                        >
                                            <Typography
                                                color="text.primary"
                                                variant="body2"
                                            >
                                                Home
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() =>
                                                scrollToSection("features")
                                            }
                                            sx={{ px: "12px", py: "6px" }}
                                        >
                                            <Typography
                                                color="text.primary"
                                                variant="body2"
                                            >
                                                Features
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() =>
                                                scrollToSection("testimonials")
                                            }
                                            sx={{ px: "12px", py: "6px" }}
                                        >
                                            <Typography
                                                color="text.primary"
                                                variant="body2"
                                            >
                                                Testimonials
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() =>
                                                scrollToSection("faq")
                                            }
                                            sx={{ px: "12px", py: "6px" }}
                                        >
                                            <Typography
                                                color="text.primary"
                                                variant="body2"
                                            >
                                                FAQ
                                            </Typography>
                                        </MenuItem>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <MenuItem
                                                sx={{ px: "12px", py: "6px" }}
                                            >
                                                <Typography
                                                    color="text.primary"
                                                    variant="body2"
                                                >
                                                    Home
                                                </Typography>
                                            </MenuItem>
                                        </Link>
                                        <Link
                                            href="/#features"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <MenuItem
                                                href="/"
                                                onClick={() =>
                                                    scrollToSection(
                                                        "testimonials"
                                                    )
                                                }
                                                sx={{ px: "12px", py: "6px" }}
                                            >
                                                <Typography
                                                    color="text.primary"
                                                    variant="body2"
                                                >
                                                    Features
                                                </Typography>
                                            </MenuItem>
                                        </Link>
                                        <Link
                                            href="/#testimonials"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <MenuItem
                                                href="/"
                                                onClick={() =>
                                                    scrollToSection(
                                                        "testimonials"
                                                    )
                                                }
                                                sx={{ px: "12px", py: "6px" }}
                                            >
                                                <Typography
                                                    color="text.primary"
                                                    variant="body2"
                                                >
                                                    Testimonials
                                                </Typography>
                                            </MenuItem>
                                        </Link>
                                        <Link
                                            href="/#faq"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <MenuItem
                                                href="/"
                                                onClick={() =>
                                                    scrollToSection(
                                                        "testimonials"
                                                    )
                                                }
                                                sx={{ px: "12px", py: "6px" }}
                                            >
                                                <Typography
                                                    color="text.primary"
                                                    variant="body2"
                                                >
                                                    FAQ
                                                </Typography>
                                            </MenuItem>
                                        </Link>
                                        <MenuItem
                                            onClick={() =>
                                                setActivityState &&
                                                setActivityState("hand")
                                            }
                                            sx={{ px: "12px", py: "6px" }}
                                        >
                                            <Typography
                                                color="text.primary"
                                                variant="body2"
                                            >
                                                Hand
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() =>
                                                setActivityState &&
                                                setActivityState("arm")
                                            }
                                            sx={{ px: "12px", py: "6px" }}
                                        >
                                            <Typography
                                                color="text.primary"
                                                variant="body2"
                                            >
                                                Arm
                                            </Typography>
                                        </MenuItem>
                                    </>
                                )}
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                alignItems: "center",
                                display: { md: "flex", xs: "none" },
                                gap: 0.5,
                            }}
                        >
                            <ToggleColorMode
                                mode={mode}
                                toggleColorMode={toggleColorMode}
                            />
                            {session ? (
                                <>
                                    <Button
                                        color="success" // Green color scheme
                                        onClick={() =>
                                            signOut({
                                                callbackUrl: "/",
                                                redirect: true,
                                            })
                                        }
                                        size="small"
                                        variant="text"
                                    >
                                        Sign out
                                    </Button>
                                    {/* {!url.includes('physiotherapy') ? (
                    <Button
                      color="success" // Green color scheme
                      variant="text"
                      size="small"
                      href="/physiotherapy"
                    >
                      Physio Page
                    </Button>
                  ) : (undefined)} */}
                                </>
                            ) : (
                                <>
                                    <Button
                                        color="success" // Green color scheme
                                        onClick={() =>
                                            signIn(undefined, {
                                                callbackUrl: "/physiotherapy",
                                            })
                                        }
                                        size="small"
                                        variant="contained"
                                    >
                                        Sign in
                                    </Button>
                                </>
                            )}
                        </Box>
                        <Box sx={{ display: { md: "none", sm: "" } }}>
                            <Button
                                aria-label="menu"
                                color="primary"
                                onClick={toggleDrawer(true)}
                                sx={{ minWidth: "30px", p: "4px" }}
                                variant="text"
                            >
                                <SelfImprovementRoundedIcon />
                            </Button>
                            <Drawer
                                anchor="right"
                                onClose={toggleDrawer(false)}
                                open={open}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: "background.paper",
                                        flexGrow: 1,
                                        minWidth: "60dvw",
                                        p: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            alignItems: "end",
                                            display: "flex",
                                            flexDirection: "column",
                                            flexGrow: 1,
                                        }}
                                    >
                                        <ToggleColorMode
                                            mode={mode}
                                            toggleColorMode={toggleColorMode}
                                        />
                                    </Box>
                                    <MenuItem
                                        onClick={() => scrollToSection("hero")}
                                    >
                                        Home
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            scrollToSection("features")
                                        }
                                    >
                                        Features
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            scrollToSection("testimonials")
                                        }
                                    >
                                        Testimonials
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            scrollToSection("highlights")
                                        }
                                    >
                                        Highlights
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            scrollToSection("pricing")
                                        }
                                    >
                                        Pricing
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => scrollToSection("faq")}
                                    >
                                        FAQ
                                    </MenuItem>
                                    <Divider />
                                </Box>
                            </Drawer>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
}

export default AppAppBar;
