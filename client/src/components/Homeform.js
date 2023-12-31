import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "./Homeform.css";
import Axios from "axios";
import uniqid from "uniqid";
import { Icon, Label, Checkbox, Message } from "semantic-ui-react";

const quicklocations = [
  "San Francisco",
  "New York",
  "US",
  "London",
  "Berlin",
  "Singapore",
];
let timeout;
export default function Homeform() {
  let { name } = useParams();
  const [stateMessage, setMessage] = useState(null);
  const [statedata, setData] = useState([]);
  const [stateError, setError] = useState({
    error: false,
  });
  const [state, setState] = useState({
    searchword: "",
    remote: false,
    quicklocation: "",
  });

  useEffect(() => {
    Axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.REACT_APP_IPKEY}`
    )
      .then((res) => {
        let quicklocation;
        if (res.data.country_name) {
          quicklocation = res.data.city + "," + res.data.country_name;
          setState({ ...state, searchword: quicklocation });
        } else {
          Axios.post("/api/job/jobs")
            .then((res) => {
              setData(res.data.jobs);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    if (state.searchword) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        Axios.post("/api/job/jobs", {
          searchword: state.searchword,
        })
          .then((res) => {
            if (res.data.jobs.length != 0) {
              setData(res.data.jobs);
              setMessage();
            } else {
              setMessage(
                <Message warning>
                  <Message.Header>Sorry</Message.Header>
                  <p>
                    No Job Is Found In {state.searchword} But You Can Look At
                    Jobs In Other Locations
                  </p>
                </Message>
              );
              Axios.post(`/api/job/jobs`)
                .then((res) => {
                  setData(res.data.jobs);
                })
                .catch((error) => {
                  console.log(error);
                });
              setError({ error: true });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }, 200);
    }
  }, [state.searchword]);
  const onSuggestSelect = (e) => {
    setState({ ...state, searchword: e.target.value });
  };
  const funcCheckbox = (ind, val) => {
    if (val.checked === true) {
      setMessage(null);
      setState({ ...state, searchword: "" });
      Axios.post(`/api/job/jobs`, { remote: "Yes" })
        .then((res) => {
          setData(res.data.jobs);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setData([]);
      setMessage(
        <Message info>
          <Message.Header>Please</Message.Header>
          <p>Enter Your Location Or Search Remote Job</p>
        </Message>
      );
    }
  };
  const QuickLocationSearch = (loc) => {
    setState({ ...state, searchword: loc });
  };

  const date_diff_indays = (date1) => {
    let dt1 = new Date(date1);
    let dt2 = new Date();
    let dt = Math.floor(
      (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
        (1000 * 60 * 60 * 24)
    );
    if (dt === 0) {
      return "Posted Today";
    } else {
      return "Posted " + dt + " days ago";
    }
  };

  return (
    <div className="search-list">
      <div className="search-wrapper">
        <div className="searchbox-background">
          <div className="searchbox">
            <h3>
              Search for a Job or post your Job offer (for{" "}
              <span className="free">free</span>!) in minutes.
            </h3>

            <input
              className="geosuggest__input"
              value={state.searchword}
              onChange={onSuggestSelect}
              placeholder="Pick a location e.g. San fransico"
            />
            <div className="remote-check">
              <Checkbox toggle onChange={funcCheckbox} />
              <p>I'm looking for remote jobs</p>
            </div>
            <div className="horizontal-line" id="z-index0">
              <div className="quick-pick">QUICK PICK</div>
            </div>
            <ul className="form-ul">
              {quicklocations.map((item, index) => {
                return (
                  <>
                    <li key={uniqid()}>
                      <Link onClick={() => QuickLocationSearch(item)} to="">
                        {item}
                      </Link>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        </div>
        {!name && stateError.error}
      </div>
      {stateMessage}
      <ul>
        {statedata
          ? statedata.map((value, index) => {
              return (
                <>
                  <Link
                    className="jobs-link"
                    onClick={(e) => e.stopPropagation()}
                    to={{
                      pathname: `/job/${value._id}`,
                      id: { _id: value._id },
                    }}
                  >
                    <li key={value._id} className="company-post-wrapper">
                      {value.featured.isfeatured ? (
                        <div className="sticker">Featured Job</div>
                      ) : (
                        ""
                      )}
                      <div className="company-post">
                        <img alt="" src={value.company.logo_url} />
                        <div className="job-details">
                          <div className="job-position-type">
                            <p>
                              <span className="job-position">
                                {value.job_title}
                              </span>
                              <span className="job-slary">
                                <Icon name="money bill alternate outline"></Icon>
                                {value.salary}
                              </span>
                            </p>
                            <p className="job-type">
                              <Icon name="info circle"></Icon>
                              <span>{value.job_type}</span>
                            </p>
                          </div>
                          <div className="company-name-location">
                            <p className="company-name">
                              <Icon name="chart area" />
                              {value.company.company_name}
                            </p>
                            <p className="company-location">
                              <Icon name="location arrow" />
                              {value.location}
                              {value.remote === "Yes" && (
                                <span className="remote">
                                  <Icon name="home" />
                                  Remote
                                </span>
                              )}
                            </p>
                          </div>
                          <p className="company-post-time">
                            <Icon name="clock outline" />
                            {date_diff_indays(value.createdAt)}
                          </p>
                          <p className="line1"></p>
                          <ul className="ul job-tags">
                            {value.tags.map((val, index) => {
                              return (
                                <li key={uniqid()}>
                                  <Label>{val}</Label>
                                </li>
                              );
                            })}
                          </ul>
                          <p className="line2"></p>
                        </div>
                      </div>
                    </li>
                  </Link>
                </>
              );
            })
          : ""}
      </ul>
    </div>
  );
}
