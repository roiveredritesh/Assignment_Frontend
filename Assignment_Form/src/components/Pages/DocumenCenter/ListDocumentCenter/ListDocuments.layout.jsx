import { useState, useEffect } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";

function ListDocuments() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7082/GetAllDocumentCenters"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(
        "https://localhost:7082/DownloadFile/" + filename,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      confirmAlert({
        title: "Deletion Confirmation !",
        message: "Are you sure to delete this record?.",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              const response = await axios.delete(
                `https://localhost:7082/DeleteDocumentCenter/${id}`
              );

              toast.success("Record deleted successfully.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              fetchData();
            },
          },
          { label: "No", onClick: () => {} },
        ],
      });
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  return (
    <div className="w-full">
      <h2 className="text-2xl text-blue-900 font-bold text-center mb-6">
        Document Center
      </h2>

      <Link
        to="/CreateDocument"
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
      >
        Create Document
      </Link>

      <table className="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400 my-5">
        <thead className="text-base font-bold text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <td className="px-6 py-3 border border-slate-200">Sr. No.</td>
            <td className="px-6 py-3 border border-slate-200">File Name</td>
            <td className="px-6 py-3 border border-slate-200">Type</td>
            <td className="px-6 py-3 border border-slate-200">Folder</td>
            <td className="px-6 py-3 border border-slate-200">Modified By</td>
            <td className="px-6 py-3 border border-slate-200">Department</td>
            <td className="px-6 py-3 border border-slate-200">Division</td>
            <td className="px-6 py-3 border border-slate-200">Office</td>
            <td className="px-6 py-3 border border-slate-200">Dowload</td>
            <td className="px-6 py-3 border border-slate-200">Edit</td>
            <td className="px-6 py-3 border border-slate-200">Delete</td>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50"
            >
              <td className="px-6 py-4 border border-slate-200">{index + 1}</td>
              <td className="px-6 py-4 border border-slate-200">
                {item.fileName}
              </td>
              <td className="px-6 py-4 border border-slate-200">{item.type}</td>
              <td className="px-6 py-4 border border-slate-200">
                {item.folder}
              </td>
              <td className="px-6 py-4 border border-slate-200">
                {item.modifiedBy}
              </td>
              <td className="px-6 py-4 border border-slate-200">
                {item.departmentName}
              </td>
              <td className="px-6 py-4 border border-slate-200">
                {item.divisionName}
              </td>
              <td className="px-6 py-4 border border-slate-200">
                {item.officeName}
              </td>
              <td className="px-6 py-4 border border-slate-200">
                <button
                  onClick={() => {
                    handleDownload(item.uploadedFileName);
                  }}
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Download
                </button>
              </td>
              <td className="px-6 py-4 border border-slate-200">
                <Link
                  to={"/UpdateDocument/" + item.id}
                  className="focus:outline-none text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-900"
                >
                  Edit
                </Link>
              </td>
              <td className="px-6 py-4 border border-slate-200">
                <button
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListDocuments;
