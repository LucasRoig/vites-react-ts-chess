import {newDocument, Document, BlocksController} from "./BlocksController";
import {newId} from "../../@core/IdGenerator";
import ApiService from "../../@core/ApiService";

export interface TempDocument {
  document: Document,
  tempId: string,
  saveData: DocumentSaveData
}

export type DocumentSaveData = null | {
  id: string,
  dbId: string
}
const LOCAL_STORAGE_KEY = "documents"

const getFromLocalStorage = (): TempDocument[] => {
  const str = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!str) {
    return []
  } else {
    return JSON.parse(str) as TempDocument[]
  }
}

const setLocalStorage = (documents: TempDocument[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents))
}

const toSerializableDocument = (document: Document): unknown => {
  return {
    ...document,
    blocks: document.blocks.map(d => BlocksController.toSerializable(d))
  }
}

const docFromSerializable = (s: any): Document => {
  return {
    ...s,
    blocks: s.blocks.map((b: any) => BlocksController.fromSerializable(b))
  }
}

export const DocumentService = {
  createTempDocument: (): TempDocument => {
    const document = newDocument();
    const tempId = newId();
    const tempDoc: TempDocument = {
      tempId,
      document,
      saveData: null
    }

    setLocalStorage([...getFromLocalStorage(), {...tempDoc, document: toSerializableDocument(document) as Document}])
    return tempDoc
  },

  updateTempDocument: (id: string, document: Document) => {
    const documents = getFromLocalStorage();
    const index = documents.findIndex(d => d.tempId === id);
    if (index >= 0) {
      documents[index].document = toSerializableDocument(document) as Document;
      setLocalStorage(documents)
    }
  },

  closeTempDocument: (id: string) => {
    const documents = getFromLocalStorage().filter(d => d.tempId !== id);
    setLocalStorage(documents)
  },

  getDocument: async (id: string): Promise<TempDocument> => {
    const doc = getFromLocalStorage().find(d => d.tempId === id);
    if (doc) {
      return {
        ...doc,
        document: docFromSerializable(doc.document)
      }
    } else {
      throw new Error("Cannot find document with id " + id)
    }
  },

  getDocumentFromDb: async (id: string, dbId: string): Promise<TempDocument> => {
    const find = getFromLocalStorage().find(doc => doc.saveData?.dbId === dbId && doc.saveData?.id === id)
    if (find) {
      return new Promise<TempDocument>(resolve => resolve({
        ...find,
        document: docFromSerializable(find.document)
      }))
    } else {
      return ApiService.get("/documents/" + id).then(doc => {
        const tempId = newId();
        const tempDoc: TempDocument = {
          tempId,
          document: doc as any,
          saveData: {
            dbId: dbId,
            id
          }
        }
        setLocalStorage([...getFromLocalStorage(), tempDoc]);
        return {
          ...tempDoc,
          document: docFromSerializable(doc)
        }
      })
    }
  },

  createDocInDb: async (document: Document, dbId: string): Promise<{id: string}> => {
    return ApiService.post<{id:string}>(`/db/${dbId}/documents`, toSerializableDocument(document))
  },

  updateDocInBase: async (document: Document, docId: string): Promise<{id: string}> => {
    return ApiService.post<{id: string}>("/documents/" + docId, toSerializableDocument(document))
  }
}
