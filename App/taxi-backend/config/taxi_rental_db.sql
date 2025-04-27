--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Homebrew)
-- Dumped by pg_dump version 17.0

-- Started on 2025-04-27 14:15:37 CDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16399)
-- Name: manager; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manager (
    name text NOT NULL,
    ssn text NOT NULL,
    email text NOT NULL
);


ALTER TABLE public.manager OWNER TO postgres;

--
-- TOC entry 3791 (class 0 OID 16399)
-- Dependencies: 217
-- Data for Name: manager; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.manager (name, ssn, email) FROM stdin;
Kirtan	123456789	kirtan@test.com
\.


--
-- TOC entry 3643 (class 2606 OID 16407)
-- Name: manager manager_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manager
    ADD CONSTRAINT manager_email_key UNIQUE (email);


--
-- TOC entry 3645 (class 2606 OID 16405)
-- Name: manager manager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manager
    ADD CONSTRAINT manager_pkey PRIMARY KEY (ssn);


-- Completed on 2025-04-27 14:15:37 CDT

--
-- PostgreSQL database dump complete
--

