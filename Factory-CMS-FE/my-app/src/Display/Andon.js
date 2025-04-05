import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import Power from "../images/power_img.png";
const Andon = () => {
    const [openPopup, setOpenPopup] = useState(null);

    const handleOpen = (index) => {
        setOpenPopup(index);
    };

    const handleClose = () => {
        setOpenPopup(null);
    };

    return (
        <div className="flex justify-center items-center min-h-screen gap-4 bg-gray-100">
            <div className="andon_main_d">
                <div
                    className="w-40 h-40 bg-blue-500 text-white flex justify-center items-center cursor-pointer rounded-lg shadow-lg hover:bg-blue-600 inner_d"
                    onClick={() => handleOpen(1)}
                >
                    <h1 style={{ textAlign: 'center', color:'black' }}>Maintenance</h1>
                    <img src={Power} style={{ width: '40%', display: 'block', margin: 'auto' }} />
                </div>
                <div
                    className="w-40 h-40 bg-green-500 text-white flex justify-center items-center cursor-pointer rounded-lg shadow-lg hover:bg-green-600  inner_d"
                    onClick={() => handleOpen(2)}
                >
                    <h1 style={{ textAlign: 'center', color:'black' }}>Quality</h1>
                    <img src={Power} style={{ width: '40%', display: 'block', margin: 'auto' }} />
                </div>
                <div
                    className="w-40 h-40 bg-red-500 text-white flex justify-center items-center cursor-pointer rounded-lg shadow-lg hover:bg-red-600  inner_d"
                    onClick={() => handleOpen(3)}
                >
                    <h1 style={{ textAlign: 'center', color:'black' }}>Material</h1>
                    <img src={Power} style={{ width: '40%', display: 'block', margin: 'auto' }} />
                </div>
                <div
                    className="w-40 h-40 bg-yellow-500 text-white flex justify-center items-center cursor-pointer rounded-lg shadow-lg hover:bg-yellow-600  inner_d"
                    onClick={() => handleOpen(4)}
                >
                    <h1 style={{ textAlign: 'center', color:'black' }}>Process</h1>
                    <img src={Power} style={{ width: '40%', display: 'block', margin: 'auto' }} />
                </div>
            </div>

            <Dialog open={openPopup === 1} onClose={handleClose}>
                <DialogTitle>Maintenance </DialogTitle>
                <DialogContent>
                    <p>This is the content for Maintenance</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openPopup === 2} onClose={handleClose}>
                <DialogTitle>Quality </DialogTitle>
                <DialogContent>
                    <p>This is the content for Quality.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openPopup === 3} onClose={handleClose}>
                <DialogTitle>Material</DialogTitle>
                <DialogContent>
                    <p>This is the content for Material.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openPopup === 4} onClose={handleClose}>
                <DialogTitle>Process</DialogTitle>
                <DialogContent>
                    <p>This is the content for Process.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Andon;
