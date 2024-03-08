import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

function UpdateDocument() {
  let { id } = useParams();
  const [fileName, setFileName] = useState("");
  const [downloadFileName, setdownloadFileName] = useState("");
  const [file, setFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [departmentval, setDepartmentval] = useState([]);
  const [offices, setOffices] = useState([]);
  const [officesval, setOfficesval] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [divisionsval, setDivisionsval] = useState([]);
  const [folder, setFolder] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");

  function show_error(error) {
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const handleDownload = async () => {
    try {
      console.log(downloadFileName);
      const response = await axios.get(
        "https://localhost:7082/DownloadFile/" + downloadFileName,
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
      link.setAttribute("download", downloadFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  useEffect(() => {
    // Fetch departments data
    axios
      .get("https://localhost:7082/GetAllDepartments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });

    // Fetch offices data
    axios
      .get("https://localhost:7082/GetAllOffices")
      .then((response) => {
        setOffices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching offices:", error);
      });

    // Fetch divisions data
    axios
      .get("https://localhost:7082/GetAllDivisions")
      .then((response) => {
        setDivisions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching divisions:", error);
      });

    // Fetch complete data
    axios
      .get("https://localhost:7082/DocumentCenter/" + id)
      .then((response) => {
        setDepartmentval(response.data.departmentId);
        setOfficesval(response.data.officeId);
        setDivisionsval(response.data.divisionId);
        setFileName(response.data.fileName);
        setFolder(response.data.folder);
        setModifiedBy(response.data.modifiedBy);
        setdownloadFileName(response.data.uploadedFileName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Validation Start
      if (fileName == "") {
        show_error("Please enter file name.");
        return;
      }
      if (e.target.department.value == "") {
        show_error("Please select department.");
        return;
      }
      if (e.target.office.value == "") {
        show_error("Please select office.");
        return;
      }
      if (e.target.division.value == "") {
        show_error("Please select division.");
        return;
      }
      if (folder == "") {
        show_error("Please enter folder name.");
        return;
      }
      if (modifiedBy == "") {
        show_error("Please enter modified by.");
        return;
      }
      //Validation End
      // Submit data
      const formData = new FormData();
      formData.append("Id", id);
      formData.append("File", file);
      formData.append("FileName", fileName);
      formData.append("DepartmentId", e.target.department.value);
      formData.append("OfficeId", e.target.office.value);
      formData.append("DivisionId", e.target.division.value);
      formData.append("Folder", folder);
      formData.append("ModifiedBy", modifiedBy);
      await axios.put(
        `https://localhost:7082/UpdateDocumentCenter/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Document saved successfully.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Clear form fields
      setFileName("");
      setFile(null);
      setFolder("");
      setModifiedBy("");
    } catch (error) {
      show_error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="flex flex-col justify-center">
        <h2 className="text-2xl text-blue-900 font-bold text-center">
          Update Document
        </h2>
        <span className="text-sm text-center mb-6">
          All <span className="text-red-700">*</span> fields are required.
        </span>
      </div>
      <div className="flex justify-center">
        <form
          className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                File Name: <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                File Upload: <span className="text-red-700">*</span>
                <a
                  href="#"
                  onClick={() => {
                    handleDownload();
                  }}
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg text-xs px-1 py-1 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Download
                </a>
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Department: <span className="text-red-700">*</span>
              </label>
              <select
                name="department"
                value={departmentval ? departmentval : ""}
                onChange={(e) => setDepartmentval(e.target.value)}
                className="shadow border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">--Select--</option>
                {departments.map((department) => (
                  <option
                    key={department.departmentId}
                    value={department.departmentId}
                  >
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                Office: <span className="text-red-700">*</span>
              </label>
              <select
                name="office"
                value={officesval ? officesval : ""}
                onChange={(e) => setOfficesval(e.target.value)}
                className="shadow border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">--Select--</option>
                {offices.map((office) => (
                  <option key={office.officeId} value={office.officeId}>
                    {office.officeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Division: <span className="text-red-700">*</span>
              </label>
              <select
                name="division"
                value={divisionsval ? divisionsval : ""}
                onChange={(e) => setDivisionsval(e.target.value)}
                className="shadow border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">--Select--</option>
                {divisions.map((division) => (
                  <option key={division.divisionId} value={division.divisionId}>
                    {division.divisionName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-zip"
              >
                Folder: <span className="text-red-700">*</span>
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
              />
            </div>

            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-zip"
              >
                Modified By: <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={modifiedBy}
                onChange={(e) => setModifiedBy(e.target.value)}
              />
            </div>

            <div className="w-full px-3 py-5 mt-4 mb-6 md:mb-0 text-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Update
              </button>

              <Link
                to="/"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-5
                 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateDocument;
