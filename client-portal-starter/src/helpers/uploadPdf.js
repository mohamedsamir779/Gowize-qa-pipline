import { pdf } from "@react-pdf/renderer";
import axios from "axios";
import * as content from "content";
import store from "../store/index.js";
import PdfOfVisa from "../components/Journey/Profiles/Applications/PdfOfVisa.js";

export const getSecureLink = async (id, index) => {
  try {
    const { data } = await axios.get(
      `${content.apiUrl}/api/v1/crm/documents/${id}/${index}`,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("authUser"))?.token
          }`,
        },
      }
    );
    return data.result;
  } catch (error) {
    console.error("Error fetching secure link:", error);
    return null;
  }
};

export const uploadPDF = async () => {
  try {
    const state = store.store.getState(); // or just `store.getState()` depending on your setup
    const clientData = state.Profile?.clientData || {};
    const documents = state.documents?.documents || [];
    const savedSignature = localStorage.getItem("savedSignature") || "";
    const selfiePhoto = localStorage.getItem("selfiePhoto") || "";

    const ipLinks = await Promise.all(
      documents
        .filter((doc) => doc.type === "ID")
        .map((doc, i) => getSecureLink(doc._id, i + 1))
    );

    const addressLinks = await Promise.all(
      documents
        .filter((doc) => doc.type === "ADDRESS")
        .map((doc, i) => getSecureLink(doc._id, i + 1))
    );

    const blob = await pdf(
      <PdfOfVisa
        clientData={clientData}
        documents={documents}
        ipLinks={ipLinks}
        addressLinks={addressLinks}
        selfiePhoto={selfiePhoto}
        savedSignature={savedSignature}
      />
    ).toBlob();
    const formData = new FormData();
    formData.append("file", blob, "document.pdf");
    formData.append("clientId", clientData._id);
    const response = await axios.post(
      `${content.apiUrl}/api/v1/cp/psp/checkout/uploadprofile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("authUser"))?.token
          }`,
        },
      }
    );
    // localStorage.removeItem("selfiePhoto");
    // localStorage.removeItem("savedSignature");

    return response.data;
  } catch (error) {
    console.error("Error generating or uploading PDF:", error);
    throw error;
  }
};