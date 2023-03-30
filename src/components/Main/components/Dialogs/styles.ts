import { DialogProps, DialogTitleProps, SxProps } from "@mui/material";

const dialogStyle: SxProps = {
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    minHeight: '200px',
};

export const dialogActionStyle: SxProps = {
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
    minWidth: '70%',
    mt: 2
};

export const dialogButtonStyle: SxProps = {
    flex: '1 1 fit-content'
};

export const dialogTitleProps: DialogTitleProps = {
    variant: 'h2',
    sx: { textAlign: 'center' }
}

export const dialogProps: Partial<DialogProps> = {
    maxWidth: 'sm',
    fullWidth: true,
    PaperProps: { sx: dialogStyle }
}