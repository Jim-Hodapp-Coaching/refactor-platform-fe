// Interacts with the note endpoints

import { Id } from "@/types/general";
import {
  defaultNote,
  isNote,
  isNoteArray,
  Note,
  parseNote,
} from "@/types/note";
import { AxiosError, AxiosResponse } from "axios";

export const fetchNotesByCoachingSessionId = async (
  coachingSessionId: Id
): Promise<Note[]> => {
  const axios = require("axios");

  var notes: Note[] = [];
  var err: string = "";

  const data = await axios
    .get(`http://localhost:4000/notes`, {
      params: {
        coaching_session_id: coachingSessionId,
      },
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": "0.0.1",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      var notes_data = response.data.data;
      if (isNoteArray(notes_data)) {
        notes_data.forEach((note_data: any) => {
          notes.push(parseNote(note_data));
        });
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        err = "Retrieval of Note failed: unauthorized.";
      } else if (error.response?.status == 404) {
        err =
          "Retrieval of Note failed: Note by coaching session Id (" +
          coachingSessionId +
          ") not found.";
      } else {
        err =
          `Retrieval of Note by coaching session Id (` +
          coachingSessionId +
          `) failed.`;
      }
    });

  if (err) {
    console.log(err);
    throw err;
  }

  return notes;
};

export const createNote = async (
  coaching_session_id: Id,
  user_id: Id,
  body: string
): Promise<Note> => {
  const axios = require("axios");

  const newNoteJson = {
    coaching_session_id: coaching_session_id,
    user_id: user_id,
    body: body,
  };
  console.debug("newNoteJson: " + JSON.stringify(newNoteJson));
  // A full real note to be returned from the backend with the same body
  var createdNote: Note = defaultNote();
  var err: string = "";

  const data = await axios
    .post(`http://localhost:4000/notes`, newNoteJson, {
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
        err = "Creation of Note failed: unauthorized.";
      } else if (error.response?.status == 500) {
        err = "Creation of Note failed: internal server error.";
      } else {
        err = `Creation of new Note failed: ${error}`;
      }
    });

  if (err) {
    console.log(err);
    throw err;
  }

  return createdNote;
};

export const updateNote = async (
  id: Id,
  user_id: Id,
  coaching_session_id: Id,
  body: string
): Promise<Note> => {
  const axios = require("axios");

  var updatedNote: Note = defaultNote();
  var err: string = "";

  const newNoteJson = {
    id: id,
    coaching_session_id: coaching_session_id,
    user_id: user_id,
    body: body,
  };

  const data = await axios
    .put(`http://localhost:4000/notes/${id}`, newNoteJson, {
      withCredentials: true,
      setTimeout: 5000, // 5 seconds before timing out trying to log in with the backend
      headers: {
        "X-Version": "0.0.1",
        "Content-Type": "application/json",
      },
    })
    .then(function (response: AxiosResponse) {
      // handle success
      if (isNote(response.data.data)) {
        updatedNote = response.data.data;
      }
    })
    .catch(function (error: AxiosError) {
      // handle error
      console.error(error.response?.status);
      if (error.response?.status == 401) {
        err = "Update of Note failed: unauthorized.";
      } else if (error.response?.status == 500) {
        err = "Update of Note failed: internal server error.";
      } else {
        err = `Update of new Note failed: ${error}`;
      }
    });

  if (err) {
    console.log(err);
    throw err;
  }

  return updatedNote;
};
