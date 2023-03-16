import { Close } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const [meme, setMeme] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [memeText, setMemeText] = useState("");
  const [memeSrc, setMemeSrc] = useState("");

  useEffect(() => {
    if (showSuccess) {
      setTimeout(() => {
        setShowSuccess(false);
      }, 10000);
    }
  }, [showSuccess]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const response = await fetch("/api/meme", {
      method: "POST",
      body: JSON.stringify({
        src: memeSrc,
        text: memeText,
      }),
    });

    const json = await response.json();

    setMeme(json.imgBase64);

    setLoading(false);
  };

  const reset = () => {
    console.log("Reset?");
    setMeme("");
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(`<img src="${meme}" />`);

    setShowSuccess(true);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      height="100vh"
      width="100vw"
      overflow="hidden"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{
        backgroundColor: "common.black",
      }}
    >
      <Box>
        <Box display="flex" alignItems="center">
          <Typography
            variant="h4"
            ml={1}
            mb={1}
            color="common.white"
          >
            Make a meme
          </Typography>
          {loading && (
            <CircularProgress sx={{ ml: 2 }} size={22} />
          )}
        </Box>
        <TextField
          type="text"
          value={memeSrc}
          onChange={(e) => setMemeSrc(e.target.value)}
          label="Source (URL)"
          sx={{ m: 1 }}
        />
        <TextField
          type="text"
          value={memeText}
          onChange={(e) => setMemeText(e.target.value)}
          label="Text"
          sx={{ m: 1 }}
        />
        {/* <input type="file" /> */}

        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            sx={{ float: "right", mr: 1 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Dialog open={!!meme} onClose={reset}>
        <Card sx={{ width: 500 }}>
          <CardMedia
            sx={{ height: 500, width: 500 }}
            image={meme}
            title={memeText}
            component="img"
          />
          <CardContent sx={{ padding: "0 !important" }}>
            <Button
              sx={{
                display: "flex",
                justifyContent: "space-between",
                color: "text.primary",
                textTransform: "none",
                height: "100%",
                width: "100%",
                p: 2,
                flexDirection: "column",
              }}
              disabled={loading}
              onClick={copyEmbedCode}
            >
              <Box
                display="flex"
                justifyContent="space-around"
                width="100%"
              >
                <TextField
                  multiline
                  value={`<img src="${meme}" />`}
                  maxRows={3}
                  label="Embed code (click to copy)"
                  sx={{
                    width: "100%",
                    ".MuiInputBase-root, textarea": {
                      cursor: "pointer",
                      width: "100%",
                    },
                  }}
                />
                {/* <Typography noWrap>
                  {`<img src="data:image/octet-stream;base64..." />`}
                </Typography> */}
              </Box>
            </Button>
          </CardContent>
        </Card>
      </Dialog>
      <Alert
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          visibility: showSuccess ? "visible" : "hidden",
          zIndex: 999999,
          ".MuiAlert-message": {
            width: "100%",
          },
          // ".MuiAlert-icon": {
          //   mt: "9px",
          // },
          ".MuiPaper-root": {
            pb: 0,
          },
        }}
        severity="success"
        action={
          <IconButton onClick={() => setShowSuccess(false)}>
            <Close />
          </IconButton>
        }
      >
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        >
          <Typography>Copied</Typography>
        </Box>
      </Alert>
    </Box>
  );
}
