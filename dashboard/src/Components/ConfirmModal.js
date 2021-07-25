import React,{useContext,useEffect,useState} from 'react';
import {AppContext} from "../AppContainer";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import "./style/DarkMode.css";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmModal({open,setOpen, question, onAgree, onDisagree}) {

const {state: {darkMode}}= useContext(AppContext);
const [commonClass, setCommonClass] = useState("");
  
  useEffect(()=>{
    setCommonClass(darkMode ? "darkmode_medium":"");
  },[darkMode])

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className={commonClass} id="alert-dialog-slide-title">{question}</DialogTitle>
        <DialogActions className={commonClass}>
          <Button onClick={()=>{
              onAgree();
              handleClose();
            }} className={commonClass}>
            Yes
          </Button>
          <Button onClick={()=>{
            onDisagree();
            handleClose();
            }} className={commonClass}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
