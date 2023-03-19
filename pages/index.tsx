import {
  Close,
  FileUpload,
  FileUploadTwoTone,
  ImageOutlined,
  InfoRounded,
  Warning,
  WarningRounded,
} from "@mui/icons-material";
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
  Input,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  useEffect,
  useState,
  CSSProperties,
  DragEventHandler,
  DragEvent,
  useMemo,
} from "react";
import prettyBytes from "pretty-bytes";

export default function Home() {
  const theme = useTheme();
  const [meme, setMeme] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [memeText, setMemeText] = useState(
    "aliens aliens aliens aliens aliens aliens aliens aliens aliens aliens aliens aliens aliens aliens aliens aliens aliens aliens aliens "
  );
  const [memeSrc, setMemeSrc] = useState("");
  const [memeUrl, setMemeUrl] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);

  const [uploadedImageData, setUploadedImageData] =
    useState("");

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

    console.log({ memeSrc });

    try {
      const response = await fetch("/api/meme", {
        method: "POST",
        body: JSON.stringify({
          src: uploadedImageData || memeSrc,
          text: memeText,
        }),
      });

      const json = await response.json();

      setMeme(json.imgBase64);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMeme("");
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(`<img src="${meme}" />`);

    setShowSuccess(true);
  };

  const preventDefault = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    preventDefault(e);
    setIsDragActive(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    preventDefault(e);
    setIsDragActive(false);
  };

  const onFileUpload = (e: DragEvent<HTMLDivElement>) => {
    preventDefault(e);
    setIsDragActive(false);

    const image = e.dataTransfer?.files[0];

    if (image.type.includes("image")) {
      const reader = new FileReader();

      reader.onload = (e) => {
        console.log(e.target);

        console.log(e.target?.result?.length);

        const image = new Image();

        image.src = e.target?.result as string;

        image.onload = () => {
          const canvas = document.createElement("canvas");

          canvas.width = image.width;
          canvas.height = image.height;

          const ctx = canvas.getContext("2d");

          ctx?.drawImage(image, 0, 0);

          const maxImageSize = 50000;

          const imageQuality = (() => {
            if (e.target?.result?.length > maxImageSize) {
              return (
                maxImageSize / e.target?.result?.length
              );
            } else {
              return 1;
            }
          })();

          console.log({ imageQuality });

          const dataURL = canvas.toDataURL(
            "image/jpeg",
            imageQuality
          );

          console.log(dataURL.length);

          setUploadedImageData(dataURL);
          console.log("setmemeSrc", dataURL);
          setMemeSrc(dataURL);
        };
      };

      reader.readAsDataURL(image);
    }
  };

  const backgroundImageSrc = useMemo(() => {
    if (typeof window === "undefined") return "";
    const img = new Image();
    img.src = uploadedImageData;
    return img.src;
  }, [uploadedImageData]);

  console.log({ memeSrc });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      height="100vh"
      width="100vw"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      onDragEnter={onDragEnter}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onFileUpload}
    >
      <Typography
        variant="h6"
        color="common.white"
        sx={{ backgroundColor: "secondary.dark" }}
        px={1}
        fontWeight="bold"
      >
        Meme Factory™
      </Typography>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        height="100%"
      >
        <Box width="340px">
          <Box display="flex" alignItems="center"></Box>
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              pt: 0,
              // boxShadow:
              //   "inset 0px 0px 100px rgba(0,0,0,0.5)",
            }}
          >
            <Box
              component="fieldset"
              style={{
                border: `6px ${theme.palette.secondary.dark} dashed`,
                height: "270px",
              }}
            >
              <Box component="legend">
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    color: "common.black",
                    border: "none",
                    p: 0,
                    minWidth: 55,
                    "&:hover": {
                      backgroundColor: "transparent",
                      border: "none",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    display="flex"
                    color={(theme) =>
                      theme.palette.info.light
                    }
                  >
                    <ImageOutlined fontSize="small" />
                    <FileUpload fontSize="small" />
                  </Typography>
                </Button>
              </Box>
              <Box component="label">
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    console.log({ file });
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const canvas =
                        document.createElement("canvas");

                      const image = new Image();

                      image.src = e.target
                        ?.result as string;

                      image.onload = () => {
                        canvas.width = image.width;
                        canvas.height = image.height;

                        const ctx = canvas.getContext("2d");

                        ctx?.drawImage(image, 0, 0);

                        const maxImageSize = 50000;

                        const imageQuality = (() => {
                          if (
                            e.target?.result?.length >
                            maxImageSize
                          ) {
                            return (
                              maxImageSize /
                              e.target?.result?.length
                            );
                          } else {
                            return 1;
                          }
                        })();
                        const dataURL = canvas.toDataURL(
                          "image/jpeg",
                          imageQuality
                        );

                        console.log({ dataURL });

                        console.log(dataURL.length);

                        setUploadedImageData(dataURL);

                        setMemeSrc(dataURL);
                      };
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  width="100%"
                  justifyContent="center"
                >
                  {memeSrc ? (
                    <img src={memeSrc} width="100%" />
                  ) : (
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      fontWeight={700}
                      px={8}
                    >
                      Drag and drop your image here
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>
          <Box mt={2}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={700}
              px={8}
              sx={{
                visibility: uploadedImageData,
              }}
            >
              {prettyBytes(uploadedImageData?.length || 0)}
            </Typography>
            <TextField
              type="text"
              value={memeUrl}
              onChange={(e) => setMemeUrl(e.target.value)}
              label="Enter a URL"
              // disabled={!!uploadedImageData}
              fullWidth
              sx={{ mt: 2 }}
            />
            <input
              type="file"
              style={{ display: "none" }}
              onChange={onFileUpload}
            />
            <TextField
              type="text"
              value={memeText}
              onChange={(e) => setMemeText(e.target.value)}
              label="Text"
              fullWidth
              sx={{ mt: 2 }}
            />
            <Box
              mt={2}
              justifyContent="flex-start"
              display="flex"
              alignItems="center"
            >
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                Submit
              </Button>
              <CircularProgress
                sx={{
                  ml: 1.5,
                  color: "common.white",
                  float: "right",
                  visibility: loading
                    ? "visible"
                    : "hidden",
                }}
                size={18}
              />
            </Box>
          </Box>
        </Box>

        <Dialog open={!!meme} onClose={reset}>
          <Card sx={{ width: 500 }}>
            <CardMedia
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
            <IconButton
              onClick={() => setShowSuccess(false)}
            >
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
    </Box>
  );
}
