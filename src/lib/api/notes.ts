// Interacts with the note endpoints

import { Id } from "@/types/general";
import { defaultNote, isNote, Note, noteToString, parseNote } from "@/types/note";
import { AxiosError, AxiosResponse } from "axios";

export const createNote = async (
    coaching_session_id: Id,
    body: string
  ): Promise<Note> => {
    const axios = require("axios");
  
    //var bodyJSON: String = JSON.stringify('"body": "' + body + '"');
    const bodyJson = {
        body: body
    };
    // A full real note to be returned from the backend with the same body
    var createdNote: Note = defaultNote();
    var err: string = "";
  
    //var strNote: string = noteToString(note);
    const data = await axios
      .post(`http://localhost:4000/notes`, bodyJson, {
        withCredentials: true,
        setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
        headers: {
          "X-Version": "0.0.1",
          "Content-Type": "application/json",
        },
      })
      .then(function (response: AxiosResponse) {
        // handle success
        const noteStr = response.data.data;
        if (isNote(noteStr)) {
          createdNote = parseNote(noteStr);
        }
      })
      .catch(function (error: AxiosError) {
        // handle error
        console.error(error.response?.status);
        if (error.response?.status == 401) {
          console.error("Creation of Note failed: unauthorized.");
          err = "Creation of Note failed: unauthorized.";
        } else if (error.response?.status == 500) {
          console.error(
            "Creation of Note failed: internal server error."
          );
          err = "Creation of Note failed: internal server error.";
        } else {
          console.log(error);
          console.error(`Creation of new Note failed.`);
          err = `Creation of new Note failed.`;
        }
      }
    );
    
    if (err)
      throw err;
  
    return createdNote;
  };