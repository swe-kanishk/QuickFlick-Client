import React from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FaFacebookF,
  FaEnvelope,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";
import { FaLinkedin, FaRegCopy } from "react-icons/fa6";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "react-toastify";

function ShareDialog({shareOpen, setShareOpen, post}) {

    const copyLink = () => {
        navigator.clipboard.writeText(
          `${window.location.href}viewPost/${post?._id}`
        );
        toast.success("Link copied to clipboard!");
      };

  return (
    <Dialog open={shareOpen} onOpenChange={setShareOpen}>
      <DialogContent className="p-5 mx-auto w-[90%] max-w-lg rounded-lg bg-white text-center shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Share this Post</h2>
        <div className="flex justify-evenly gap-8 mb-2">
          <FacebookShareButton
            url={`${window.location.href}viewPost/${post?._id}`}
          >
            <span className="flex items-center justify-center p-2 overflow-hidden aspect-square bg-blue-600 rounded-full">
              <FaFacebookF className="h-5 w-5 text-white" />
            </span>
          </FacebookShareButton>
          <EmailShareButton
            url={`${window.location.href}viewPost/${post?._id}`}
          >
            <span className="flex items-center justify-center p-3 overflow-hidden aspect-square bg-black rounded-full">
              <FaEnvelope className="h-5 w-5 text-white" />
            </span>
          </EmailShareButton>
          <TelegramShareButton
            url={`${window.location.href}viewPost/${post?._id}`}
          >
            <span className="flex items-center justify-center p-2 overflow-hidden aspect-square bg-blue-600 rounded-full">
              <FaTelegramPlane className="h-6 w-6 text-white" />
            </span>
          </TelegramShareButton>
          <WhatsappShareButton
            url={`${window.location.href}viewPost/${post?._id}`}
          >
            <span className="flex items-center justify-center p-2 overflow-hidden aspect-square bg-green-600 rounded-full">
              <FaWhatsapp className="h-6 w-6 text-white" />
            </span>
          </WhatsappShareButton>
          <LinkedinShareButton
            url={`${window.location.href}viewPost/${post?._id}`}
          >
            <span className="flex items-center justify-center p-2 overflow-hidden aspect-square bg-blue-600 rounded-full">
              <FaLinkedin className="h-6 w-6 text-white" />
            </span>
          </LinkedinShareButton>
        </div>
        <span className="mx-auto font-semibold">or</span>
        <input
          type="text"
          value={`${window.location.href}viewPost/${post?._id}`}
          disabled
          className="px-3 py-2 rounded-xl border border-blue-600"
        />
        <Button
          variant="ghost"
          className="w-fit mx-auto bg-blue-700 text-white hover:bg-blue-600 flex items-center justify-center gap-2 hover:text-white text-sm"
          onClick={copyLink}
        >
          <FaRegCopy />
          <span>Copy Link</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;
