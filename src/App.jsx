import { useState, useEffect } from 'react';
import Header from './components/Header';
import Body from './components/Body';
import { ThemeProvider } from './context/theme'
import Footer from './components/Footer';

function PlaylistDuration() {

  const getInitialTheme = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedPrefs = window.localStorage.getItem("color-theme")
      if (typeof storedPrefs === "string") {
        return storedPrefs
      }

      const userMedia = window.matchMedia("(prefers-color-scheme: dark)")
      if (userMedia.matches) {
        return "dark"
      }
    }
    // If you want to use light theme as the default, return "light" instead
    return "dark"
  }

  

  const [themeMode, setThemeMode] = useState(getInitialTheme())
  const lightTheme = () => {
    //code to set the theme to local storage
    window.localStorage.setItem("color-theme", "light")    
    setThemeMode("light")
    window.dispatchEvent(new Event('theme-change'));

  }
  const darkTheme = () => {
    window.localStorage.setItem("color-theme", "dark")
    setThemeMode("dark")
    window.dispatchEvent(new Event('theme-change'));

  }

  useEffect(() => {
    document.querySelector("html").classList.remove("dark", "light")
    document.querySelector("html").classList.add(themeMode)
  }, [themeMode])


  return (
    <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
    <div className='font-body h-screen text-black dark:text-[#ffffffcc] bg-white dark:bg-[#25282C] overflow-hidden'>
      <Header/>
      <Body />
      <Footer />
    </div>
    </ThemeProvider>
  );
}

export default PlaylistDuration;
