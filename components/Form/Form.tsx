import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";

export default function Form() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [nationality, setNationality] = useState<any>();
  const [age, setAge] = useState<any>();
  const [gender, setGender] = useState<any>();
  const [error, setError] = useState("");
  const endpoints = [
    { name: "nationality", path: "https://api.nationalize.io?name=" },
    { name: "age", path: "https://api.agify.io?name=" },
    { name: "gender", path: "https://api.genderize.io?name=" },
  ];
  const handleInput = (e: any) => {
    setName(e.target.value);
  };

  useEffect(() => {}, [formData]);

  const fetchData = async (endpoint: any) => {
    try {
      const data = await (await fetch(`${endpoint.path}${name}`).then()).json();
      switch (endpoint.name) {
        case "nationality":
          setNationality(data);
          break;
        case "age":
          setAge(data);
          break;
        default:
          setGender(data);
          break;
      }
      return data;
    } catch (err: any) {
      setError("Failed to fetch data from the server.");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    resetInputs();
    await endpoints.forEach(async (endpoint, index) => {
      setFormData({ ...formData, ...(await fetchData(endpoint)) });
      setLoading(index > endpoints.length);
    });
  };

  const resetInputs = () => {
    setError("");
    setLoading(true);
    setNationality(null);
    setAge(null);
    setGender(null);
  };

  return (
    <div className="w-full bg-white py-20">
      <form onSubmit={handleSubmit} className="w-80 m-auto mb-10">
        <div>
          <label
            htmlFor="first_name"
            className="block mb-2 text-sm font-medium text-dark-900 dark:text-dark-300"
          >
            Write a name
          </label>
          <input
            onChange={handleInput}
            type="text"
            id="first_name"
            className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Name"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {loading ? <Loader width="16" height="16" /> : "Submit"}
        </button>
      </form>
      {error}
      {nationality && age && gender ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto w-11/12 mt-5">
          <div className="bg-gray-50 rounded-lg px-4">
            <p className="mt-4 text-xl mb-3 underline decoration-pink-500">The provided name might be from one of this countries:</p>
            {nationality["country"].map((nat: any, index: number) => (
              <div className="text-2xl mb-3" key={index}>
                {(index+1)}.{nat.country_id}
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-lg px-4 pb-10">
            <p className="mt-4 text-xl text-center underline decoration-pink-500">Age</p>
            <p className="text-2xl text-center py-8 md:py-0 md:mt-7">{age["age"]}</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-4 pb-10">
            <p className="mt-4 text-xl text-center underline decoration-pink-500">Gender</p>
            <p className="text-2xl text-center py-8 md:py-0 md:mt-7">{gender["gender"]}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
