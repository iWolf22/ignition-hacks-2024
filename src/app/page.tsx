"use client";

import Testimonials from "@/ui-components/Testimonials";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { PaletteMode } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Head from "next/head";
import * as React from "react";

import OpenAIAssistant from "../components/OpenAIAssistant";
import AppAppBar from "../ui-components/AppAppBar";
import FAQ from "../ui-components/FAQ";
import Features from "../ui-components/Features";
import Footer from "../ui-components/Footer";
import Hero from "../ui-components/Hero";
import Highlights from "../ui-components/Highlights";
import LogoCollection from "../ui-components/LogoCollection";
import Pricing from "../ui-components/Pricing";
import getLPTheme from "./getLPTheme";

interface ToggleCustomThemeProps {
    showCustomTheme: Boolean;
    toggleCustomTheme: () => void;
}

function ToggleCustomTheme({
    showCustomTheme,
    toggleCustomTheme,
}: ToggleCustomThemeProps) {
    return (
        <Box
            sx={{
                alignItems: "center",
                bottom: 24,
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                width: "100dvw",
            }}
        >
            <ToggleButtonGroup
                aria-label="Platform"
                color="primary"
                exclusive
                onChange={toggleCustomTheme}
                sx={{
                    "& .Mui-selected": {
                        pointerEvents: "none",
                    },
                    backgroundColor: "background.default",
                }}
                value={showCustomTheme}
            >
                <ToggleButton value>
                    <AutoAwesomeRoundedIcon sx={{ fontSize: "20px", mr: 1 }} />
                    Custom theme
                </ToggleButton>
                <ToggleButton value={false}>Material Design 2</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}

export default function LandingPage() {
    const [mode, setMode] = React.useState<PaletteMode>("light");
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });

    const toggleColorMode = () => {
        setMode((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

    React.useEffect(() => {
        document.body.style.overflow = "scroll";
    }, []);

    return (
        <>
            <Head>
                <link
                    href="/apple-touch-icon.png"
                    rel="apple-touch-icon"
                    sizes="180x180"
                />
                <link
                    href="/favicon-32x32.png"
                    rel="icon"
                    sizes="32x32"
                    type="image/png"
                />
                <link
                    href="/favicon-16x16.png"
                    rel="icon"
                    sizes="16x16"
                    type="image/png"
                />
                <link href="/site.webmanifest" rel="manifest" />
            </Head>
            <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
                <CssBaseline />
                <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
                <Hero />
                <Box sx={{ bgcolor: "background.default" }}>
                    <Features />
                    <Divider />
                    <Testimonials />
                    <Divider />
                    <FAQ />
                </Box>
            </ThemeProvider>
        </>
    );
}
