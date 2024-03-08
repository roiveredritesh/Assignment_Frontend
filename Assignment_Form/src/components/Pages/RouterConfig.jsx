import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ListDocuments from "./DocumenCenter/ListDocumentCenter/ListDocuments.layout";
import CreateDocument from "./DocumenCenter/Createdocument/CreateDocument.layout";
import DocumentCenter from "./DocumenCenter/DocumentCenter.layout";
import UpdateDocument from "./DocumenCenter/Updatedocument/Updatedocument.layout";
const router = createBrowserRouter([
  {
    path: "/",
    element: <ListDocuments />,
  },
  {
    path: "/CreateDocument",
    element: <CreateDocument />,
  },
  {
    path: "/UpdateDocument/:id",
    element: <UpdateDocument />,
  },
]);

function RouterConfig() {
  return (
    <div>
      <RouterProvider router={router}>
        <DocumentCenter />
      </RouterProvider>
    </div>
  );
}
export default RouterConfig;
