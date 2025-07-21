--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-15 23:05:43

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

--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 5896 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 234 (class 1259 OID 17571)
-- Name: group_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_members (
    tale_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.group_members OWNER TO neondb_owner;

--
-- TOC entry 233 (class 1259 OID 17558)
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    group_id integer NOT NULL,
    name text,
    description text,
    source_id integer,
    source_page text,
    notes text
);


ALTER TABLE public.groups OWNER TO neondb_owner;

--
-- TOC entry 224 (class 1259 OID 17476)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    location_id integer NOT NULL,
    name text NOT NULL,
    region text,
    description text,
    lat double precision,
    lon double precision,
    geog_point public.geography(Point,4326)
);


ALTER TABLE public.locations OWNER TO neondb_owner;

--
-- TOC entry 223 (class 1259 OID 17475)
-- Name: locations_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_location_id_seq OWNER TO neondb_owner;

--
-- TOC entry 5897 (class 0 OID 0)
-- Dependencies: 223
-- Name: locations_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locations_location_id_seq OWNED BY public.locations.location_id;


--
-- TOC entry 232 (class 1259 OID 17557)
-- Name: motif_groupings_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.motif_groupings_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.motif_groupings_group_id_seq OWNER TO neondb_owner;

--
-- TOC entry 5898 (class 0 OID 0)
-- Dependencies: 232
-- Name: motif_groupings_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.motif_groupings_group_id_seq OWNED BY public.groups.group_id;


--
-- TOC entry 231 (class 1259 OID 17544)
-- Name: sources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sources (
    source_id integer NOT NULL,
    title text,
    link text
);


ALTER TABLE public.sources OWNER TO neondb_owner;

--
-- TOC entry 230 (class 1259 OID 17543)
-- Name: publications_publication_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.publications_publication_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publications_publication_id_seq OWNER TO neondb_owner;

--
-- TOC entry 5899 (class 0 OID 0)
-- Dependencies: 230
-- Name: publications_publication_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.publications_publication_id_seq OWNED BY public.sources.source_id;


--
-- TOC entry 236 (class 1259 OID 17587)
-- Name: references; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."references" (
    reference_id integer NOT NULL,
    from_tale_id integer,
    to_tale_id integer,
    to_group_id integer,
    source_id integer,
    source_page text,
    notes text
);


ALTER TABLE public."references" OWNER TO neondb_owner;

--
-- TOC entry 235 (class 1259 OID 17586)
-- Name: relations_relation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.relations_relation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.relations_relation_id_seq OWNER TO neondb_owner;

--
-- TOC entry 5900 (class 0 OID 0)
-- Dependencies: 235
-- Name: relations_relation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.relations_relation_id_seq OWNED BY public."references".reference_id;


--
-- TOC entry 228 (class 1259 OID 17506)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    tag_id integer NOT NULL,
    name text NOT NULL,
    description text,
    type text
);


ALTER TABLE public.tags OWNER TO neondb_owner;

--
-- TOC entry 227 (class 1259 OID 17505)
-- Name: tags_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_tag_id_seq OWNER TO neondb_owner;

--
-- TOC entry 5901 (class 0 OID 0)
-- Dependencies: 227
-- Name: tags_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_tag_id_seq OWNED BY public.tags.tag_id;


--
-- TOC entry 229 (class 1259 OID 17516)
-- Name: tale_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tale_tags (
    tale_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.tale_tags OWNER TO neondb_owner;

--
-- TOC entry 226 (class 1259 OID 17492)
-- Name: tales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tales (
    tale_id integer NOT NULL,
    title text NOT NULL,
    culture_group text,
    collector text,
    year_collected integer,
    location_id integer,
    notes text,
    source_page text,
    source_id integer
);


ALTER TABLE public.tales OWNER TO neondb_owner;

--
-- TOC entry 225 (class 1259 OID 17491)
-- Name: tales_tale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tales_tale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tales_tale_id_seq OWNER TO neondb_owner;

--
-- TOC entry 5902 (class 0 OID 0)
-- Dependencies: 225
-- Name: tales_tale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tales_tale_id_seq OWNED BY public.tales.tale_id;


--
-- TOC entry 5691 (class 2604 OID 17561)
-- Name: groups group_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN group_id SET DEFAULT nextval('public.motif_groupings_group_id_seq'::regclass);


--
-- TOC entry 5687 (class 2604 OID 17479)
-- Name: locations location_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN location_id SET DEFAULT nextval('public.locations_location_id_seq'::regclass);


--
-- TOC entry 5692 (class 2604 OID 17590)
-- Name: references reference_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."references" ALTER COLUMN reference_id SET DEFAULT nextval('public.relations_relation_id_seq'::regclass);


--
-- TOC entry 5690 (class 2604 OID 17547)
-- Name: sources source_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sources ALTER COLUMN source_id SET DEFAULT nextval('public.publications_publication_id_seq'::regclass);


--
-- TOC entry 5689 (class 2604 OID 17509)
-- Name: tags tag_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN tag_id SET DEFAULT nextval('public.tags_tag_id_seq'::regclass);


--
-- TOC entry 5688 (class 2604 OID 17495)
-- Name: tales tale_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tales ALTER COLUMN tale_id SET DEFAULT nextval('public.tales_tale_id_seq'::regclass);


--
-- TOC entry 5888 (class 0 OID 17571)
-- Dependencies: 234
-- Data for Name: group_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.group_members VALUES (58, 3);
INSERT INTO public.group_members VALUES (59, 3);
INSERT INTO public.group_members VALUES (60, 3);


--
-- TOC entry 5887 (class 0 OID 17558)
-- Dependencies: 233
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.groups VALUES (2, 'The Prince Who Was Deserted', NULL, 16, '784', '1. no tales from this source added yet --- 2. group_memebers for this group have not been added either');
INSERT INTO public.groups VALUES (3, 'A Woman Who Was Married With a Dog', NULL, 17, '359', '1. some tales from this source haven''t been added yet: starting from "Cumberland Sound (p. 165)" (when adding, be sure to add them to the group_memebers tabel too) ---  2. The following references were not added: "Greenland (Rink, p. 471)" (could not access it); "East Greenland (Holm, p. 56)" (not in English)');


--
-- TOC entry 5878 (class 0 OID 17476)
-- Dependencies: 224
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.locations VALUES (41, 'Quinault (general)', 'Coast Salish', 'Quinault Indian Nation Tribal Headquaters', 47.3394438472246, -124.285567687681, '0101000020E610000097D8B1BD46125FC03C545FE572AB4740');
INSERT INTO public.locations VALUES (42, 'Kaska (general)', 'British Columbia, Yukon', 'Daylu Dena Council', 59.9236288342291, -128.495219431584, '0101000020E6100000E7DF6BD6D80F60C00B543A7839F64D40');
INSERT INTO public.locations VALUES (43, 'Chilcotin (general)', 'British Columbia', 'Carrier-Chilcotin Tribal Council', 52.1285139780896, -122.145693734964, '0101000020E6100000C2B9D00B53895EC0A27C622573104A40');
INSERT INTO public.locations VALUES (44, 'Nez Perce (general)', 'Idaho', 'Nez Perce Tribe Headquaters', 46.3986664522094, -116.802808876646, '0101000020E610000084887B3861335DC03820978007334740');
INSERT INTO public.locations VALUES (45, 'Tahltan (general)', 'British Columbia', 'Tahltan Band Council', 57.901485974936, -131.179714146527, '0101000020E6100000C9BEE137C06560C08F1376E463F34C40');
INSERT INTO public.locations VALUES (46, 'Hope, Canada', 'British Columbia', 'Hope District Hall', 49.3803280456355, -121.441608496157, '0101000020E610000053284850435C5EC0C7E0E296AEB04840');
INSERT INTO public.locations VALUES (47, 'Upper Skagit (general)', 'Washington', 'Upper Skagit Indian Tribe', 48.5403180893212, -122.182349600158, '0101000020E61000008247A89DAB8B5EC02F89A52429454840');
INSERT INTO public.locations VALUES (48, 'Quileute (general)', 'Washington', 'Quileute Tribal Council', 47.9097826319534, -124.635934570847, '0101000020E6100000C10BEA26B3285FC0B55ADDC173F44740');
INSERT INTO public.locations VALUES (49, 'Siletz Reservation (general)', 'Oregon', 'Confederated Tribes of Siletz Indians The: ADMINISTRATION & PROGRAMS BUILDING', 44.7198995606101, -123.916750867566, '0101000020E6100000A3B1D40BACFA5EC0D29C36AB255C4640');
INSERT INTO public.locations VALUES (50, 'Coos (general)', 'Oregon', 'Confederated Tribes of Coos, Lower Umpqua & Siuslaw Indians Tribal Hall', 43.3886205396688, -124.265959265595, '0101000020E61000001EF3027A05115FC037375E51BEB14540');
INSERT INTO public.locations VALUES (51, 'Shoalwater Bay (general)', 'Washington', 'Shoalwater Bay Tribe Tribal headquaters', 46.7216501932415, -124.016399834658, '0101000020E61000000561E4B10C015FC0EA8F95085F5C4740');
INSERT INTO public.locations VALUES (52, 'Arapaho (general)', 'Colorado, Wyoming', 'Blue Sky Hall', 43.0265491907351, -108.776695801907, '0101000020E610000063084F62B5315BC0A5F8C0F665834540');
INSERT INTO public.locations VALUES (53, 'Blackfoot (general)', 'Alberta, Montana', 'Blackfoot Confederacy', 50.9855215257612, -114.068150861978, '0101000020E6100000F1D86E955C845CC0FE52C191257E4940');
INSERT INTO public.locations VALUES (54, 'Chinook (general)', NULL, 'Chinook Indian Tribe Office', 46.63255822886827, -123.95540219945813, NULL);
INSERT INTO public.locations VALUES (55, 'Tsetsaut (general)', NULL, 'Portland Inlet', 54.73314420648496, -130.40025217121413, NULL);
INSERT INTO public.locations VALUES (56, 'Nlakaʼpamux (general)', NULL, 'Nlaka''pamux Nation Tribal Council', 50.26525676932274, -121.5989155523199, NULL);
INSERT INTO public.locations VALUES (57, 'Smith Sound Eskimo (general)', 'Greenland', 'Coordinates from Smith Sound Wikipedia page', 78.4166666666667, -74, NULL);
INSERT INTO public.locations VALUES (58, 'Greenland (general)', 'Greenland', 'Locations are just a point in Greenland that is more or less in the center', 65.8746966381556, -46.14260860779414, NULL);
INSERT INTO public.locations VALUES (59, 'Cumberland Sound (general)', 'Arctic', 'Coordinates from Cumberland Sound Wikipedia page', 65.333333, -66.016667, NULL);


--
-- TOC entry 5890 (class 0 OID 17587)
-- Dependencies: 236
-- Data for Name: references; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."references" VALUES (1, 53, 35, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (2, 53, 36, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (3, 53, 37, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (4, 53, 38, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (5, 53, 39, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (6, 53, 40, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (7, 53, 41, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (8, 53, 42, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (9, 53, 43, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (10, 53, 44, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (11, 53, 45, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (12, 53, 46, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (13, 53, 47, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (14, 53, 48, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (15, 53, 49, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (16, 53, 50, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (17, 53, 51, NULL, 15, '347', NULL);
INSERT INTO public."references" VALUES (18, 53, NULL, 2, 15, '347', NULL);
INSERT INTO public."references" VALUES (19, 53, NULL, 3, 15, '347', NULL);
INSERT INTO public."references" VALUES (20, 41, 54, NULL, 1, '127', NULL);
INSERT INTO public."references" VALUES (21, 41, 55, NULL, 1, '127', NULL);
INSERT INTO public."references" VALUES (22, 41, 56, NULL, 1, '127', NULL);
INSERT INTO public."references" VALUES (23, 41, 37, NULL, 1, '127', NULL);
INSERT INTO public."references" VALUES (24, 41, 57, NULL, 1, '127', NULL);
INSERT INTO public."references" VALUES (25, 41, 50, NULL, 1, '127', NULL);


--
-- TOC entry 5885 (class 0 OID 17544)
-- Dependencies: 231
-- Data for Name: sources; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sources VALUES (1, 'Memoirs of the American Museum of Natural History, v. 4, pt. 3', 'https://digitallibrary.amnh.org/items/838231c5-005c-4a56-83fc-26ac1ec86461');
INSERT INTO public.sources VALUES (2, 'The Journal of American Folklore, v. 30, no. 118', 'https://www-jstor-org.ezp-prod1.hul.harvard.edu/stable/534495?origin=crossref&seq=1');
INSERT INTO public.sources VALUES (3, 'Memoirs of the American Museum of Natural History, v. 4, pt. 1', 'https://digitallibrary.amnh.org/items/6594eeb3-a3fb-4aee-bf40-96cd45b204af');
INSERT INTO public.sources VALUES (4, 'Memoirs of the American Folk-lore Society, v. 11', 'https://babel.hathitrust.org/cgi/pt?id=uc1.b3501902&seq=17');
INSERT INTO public.sources VALUES (6, 'The Journal of American Folklore, v. 37', 'https://babel.hathitrust.org/cgi/pt?id=uga1.32108058696025&seq=428');
INSERT INTO public.sources VALUES (7, 'The Journal of American Folklore, v. 32', 'https://babel.hathitrust.org/cgi/pt?id=uga1.32108058695977&seq=288');
INSERT INTO public.sources VALUES (8, 'Bulletin of the Bureau of American Ethnology, v. 67', 'https://archive.org/details/b2998080x/page/n5/mode/2up');
INSERT INTO public.sources VALUES (9, 'Columbia University contributions to anthropology, v.1', 'https://babel.hathitrust.org/cgi/pt?id=osu.32435071293443&seq=179');
INSERT INTO public.sources VALUES (10, 'Edward Curtis, The North American Indian, v. 9', 'https://archive.org/details/northamericanind0009curt/page/n257/mode/2up?view=theater');
INSERT INTO public.sources VALUES (11, 'Publications of the Field Columbian Museum. Anthropological Series, Vol. 5', 'https://www-jstor-org.ezp-prod1.hul.harvard.edu/stable/29782036?seq=1');
INSERT INTO public.sources VALUES (12, 'The Journal of American Folklore, v. 13', 'https://babel.hathitrust.org/cgi/pt?id=uga1.32108057773098&seq=191');
INSERT INTO public.sources VALUES (13, 'Anthropological Papers of the American Museum of Natural History, v. 2', 'https://digitallibrary.amnh.org/items/97c0cd60-7351-4438-998e-4143572344c8');
INSERT INTO public.sources VALUES (14, 'American Anthropologist, new series, v. 4', 'https://archive.org/details/in.gov.ignca.36647/page/617/mode/2up');
INSERT INTO public.sources VALUES (15, 'Stith Thompson, Tales of the North American Indians', 'https://babel.hathitrust.org/cgi/pt?id=mdp.39015028716614&seq=379');
INSERT INTO public.sources VALUES (16, 'Report of the Bureau of American Ethnology, vol. 31, p. 785', 'https://archive.org/details/annualreportofbu31smithso/page/784/mode/2up?view=theater');
INSERT INTO public.sources VALUES (18, 'Franz Boas, Chinook Texts', 'https://archive.org/details/chinooktexts00boas/page/8/mode/2up?view=theater');
INSERT INTO public.sources VALUES (5, 'The Journal of American Folklore, v. 34', 'https://babel.hathitrust.org/cgi/pt?id=njp.32101076897345&seq=10');
INSERT INTO public.sources VALUES (19, 'The Journal of American Folklore, v. 10', 'https://babel.hathitrust.org/cgi/pt?id=hvd.32044009511148&seq=53');
INSERT INTO public.sources VALUES (20, 'The Journal of American Folklore, v. 9', 'https://babel.hathitrust.org/cgi/pt?id=hvd.32044010498350&seq=269');
INSERT INTO public.sources VALUES (21, 'Franz Boas, Kathlamet texts', 'https://babel.hathitrust.org/cgi/pt?id=uva.x001726222&seq=163');
INSERT INTO public.sources VALUES (22, 'James Teit, Traditions of the Thompson River Indians of British Columbia', 'https://babel.hathitrust.org/cgi/pt?id=miun.ajs8770.0001.001&seq=78');
INSERT INTO public.sources VALUES (23, 'The Journal of American Folklore, v. 12', 'https://babel.hathitrust.org/cgi/pt?id=inu.30000099904892&seq=180');
INSERT INTO public.sources VALUES (24, 'Hinrich Rink, Tales and Traditions of the Eskimo', 'https://archive.org/details/talestraditionso01rink/page/470/mode/2up?view=theater');
INSERT INTO public.sources VALUES (17, 'Bulletin of the American Museum of Natural History, v. 15', 'https://archive.org/details/in.ernet.dli.2015.28443/page/n379/mode/2up');


--
-- TOC entry 5686 (class 0 OID 16711)
-- Dependencies: 219
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5882 (class 0 OID 17506)
-- Dependencies: 228
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5883 (class 0 OID 17516)
-- Dependencies: 229
-- Data for Name: tale_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5880 (class 0 OID 17492)
-- Dependencies: 226
-- Data for Name: tales; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tales VALUES (54, 'Cikla Icta''kxanam. Cikla Their Myth.', 'Chinook', 'Franz Boas', 1891, 54, '1. year is 1890-1891 --- 2. For location, I have put the Chinook (general), but Boas says he collected the stories specifically form Bay Center, Washington, which happens to be exactly where the Tribal Office is located, so I put it as I do with the other tales', '9', 18);
INSERT INTO public.tales VALUES (36, 'The Dog-Man and Dog-Children', 'Kaska', 'James Teit', 1915, 42, 'year is 1912-1915', '463', 2);
INSERT INTO public.tales VALUES (37, 'Lendix.tux', 'Chilcotin', 'Livingston Farrand', 1897, 43, 'NaN', '7', 3);
INSERT INTO public.tales VALUES (38, '(no title)', 'Nez Perce', 'Herbert Spinden', 1907, 44, 'no actual text of the tale', '198', 4);
INSERT INTO public.tales VALUES (55, 'The Children of the Dog', 'Tsetsaut', 'Franz Boas', 1895, 55, '1. year is 1894-1895 --- 2. The year and collector info is in The Journal of American Folklore, v. 9, p. 257', '37', 19);
INSERT INTO public.tales VALUES (56, 'Tia''pexoacxoac', 'Kathlamet', 'Franz Boas', 1890, 54, 'For location, the Chinook (general) is given. In source, it is said that the tale is collected at Bay Center. Also, the Kathlamet appear to have later merged with the Chinook (see wiki)', '155', 21);
INSERT INTO public.tales VALUES (43, 'The Story of the Dog Children', 'Alsea', 'Leo Frachtenberg', 1910, 49, 'NaN', '125', 8);
INSERT INTO public.tales VALUES (44, 'The Story of the Dog-Children', 'Alsea', 'Leo Frachtenberg', 1900, 49, 'NaN', '137', 8);
INSERT INTO public.tales VALUES (45, 'The Woman Who Married the Dog', 'Coos', 'Harry Hull St. Clair', 1903, 50, 'NaN', '167', 9);
INSERT INTO public.tales VALUES (57, 'The Dog and the Girl', 'Nkamtcinemux', 'James Teit', 1898, 56, '1. In the source, it is indicated that the Nkamtcinemux (which are part of the Nlakaʼpamux) live in the upper part of the Thompson River, while the location chosen puts them at the Nlakaʼpamux Tribal Council which is in the middle, or where the river joins Fraser river. --- 2. 1898 is year of publication, since year of collection is not indicated', '62', 22);
INSERT INTO public.tales VALUES (35, 'Story of the Dog Children', 'Quinault', 'Livingston Farrand', 1898, 41, '1. References not in English, stories not added: "Cf. Boas, Indianische Sagen, etc., pp. 25, 93, 114, 132, 263", "Krause, Die Tlinkit Indianer, p. 269", "Petitot, Traditions Indiennes, etc., p. 311" --- 2. All other references have been added!', '127', 1);
INSERT INTO public.tales VALUES (58, 'The Woman Who Married a Dog', 'Smith Sound Eskimo', 'Alfred Kroeber', 1898, 57, '1. the year is 1897-1898', '168', 23);
INSERT INTO public.tales VALUES (59, 'A Woman Who Was Mated With a Dog', 'Eskimo', 'Hinrich Rink', 1875, 58, '1. 1875 is year of publication --- 2. The location is just Greenland in general, and the culture group is just Eskimo in general, no concrete details are given for the specific tale', '471', 24);
INSERT INTO public.tales VALUES (51, 'Dog-Chief', 'Blackfoot', '(?) David Charles Duvall, Clark Wissler', 1907, 53, 'year is 1903-1907', '107', 13);
INSERT INTO public.tales VALUES (60, 'The Woman Who Married the Dog', 'Eskimo', 'James Mutch', 1907, 59, '1. 1907 is year of publication', '165', 17);
INSERT INTO public.tales VALUES (46, 'The Girl Who Bore Puppies', 'Shoalwater Bay', 'Edward Curtis', 1913, 51, 'Collector not explicitly indicated, but I think it''s implied that this is the author; 1913 is year of publication, since year of collection is not indicated', '121', 10);
INSERT INTO public.tales VALUES (39, 'A Tse''dextsi Story: or, the Girl That Married the Dog-Man', 'Tahltan', 'James Teit', 1921, 45, '1921 is year of publication, since year of collection is not indicated', '248', 5);
INSERT INTO public.tales VALUES (40, 'The Dog-Children', 'Stolo, Lower Fraser', 'James Teit', 1917, 46, '1917 is year of publication, since year of collection is not indicated', '130', 4);
INSERT INTO public.tales VALUES (41, 'The Girl Who Married a Dog', 'Skagit', 'Herman Haeberlin', 1924, 47, '1924 is year of publication, since year of collection is not indicated', '418', 6);
INSERT INTO public.tales VALUES (42, 'The Children of the Dog', 'Quileute', 'Livingston Farrand', 1919, 48, '1919 is year of publication, since year of collection is not indicated', '272', 7);
INSERT INTO public.tales VALUES (47, 'The White Dog and the Woman', 'Arapaho', 'George Dorsay', 1903, 52, '1903 is year of publication, since year of collection is not indicated', '205', 11);
INSERT INTO public.tales VALUES (48, 'The White Dog and the Woman', 'Arapaho', 'Alfred Kroeber', 1903, 52, '1903 is year of publication, since year of collection is not indicated', '207', 11);
INSERT INTO public.tales VALUES (49, 'The White Dog, the Woman, and the Seven Puppies', 'Arapaho', 'George Dorsay', 1903, 52, '1903 is year of publication, since year of collection is not indicated', '209', 11);
INSERT INTO public.tales VALUES (50, '(no title)', '(?) Arapaho', '(?) Alfred Kroeber', 1899, 52, 'Collector not indicated, but implied? Also, is it Arapaho as the note says or is this Cheyenne?', '181', 12);
INSERT INTO public.tales VALUES (53, 'The Dog-Husband', NULL, NULL, NULL, NULL, '1. This story is just a reprint of "Story of the Dog Children" in Memoirs of the American Museum of Natural History, v. 4, pt. 3, p. 127. This story will not appear on the map, and all relevant information can be found in the entry for the first print of the story. However, the references from this story to other stories will correspond to this entry. --- 2. The tale "Siberia: Bogaras, AA, new ser., iv, 618" from the references has not been added to the "tales" table, and so not to the "references" table either. All other references are in the database.', '167', 15);


--
-- TOC entry 5903 (class 0 OID 0)
-- Dependencies: 223
-- Name: locations_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_location_id_seq', 59, true);


--
-- TOC entry 5904 (class 0 OID 0)
-- Dependencies: 232
-- Name: motif_groupings_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.motif_groupings_group_id_seq', 3, true);


--
-- TOC entry 5905 (class 0 OID 0)
-- Dependencies: 230
-- Name: publications_publication_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.publications_publication_id_seq', 24, true);


--
-- TOC entry 5906 (class 0 OID 0)
-- Dependencies: 235
-- Name: relations_relation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.relations_relation_id_seq', 25, true);


--
-- TOC entry 5907 (class 0 OID 0)
-- Dependencies: 227
-- Name: tags_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_tag_id_seq', 1, false);


--
-- TOC entry 5908 (class 0 OID 0)
-- Dependencies: 225
-- Name: tales_tale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tales_tale_id_seq', 60, true);


--
-- TOC entry 5713 (class 2606 OID 17575)
-- Name: group_members group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_pkey PRIMARY KEY (tale_id, group_id);


--
-- TOC entry 5711 (class 2606 OID 17565)
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (group_id);


--
-- TOC entry 5697 (class 2606 OID 17485)
-- Name: locations locations_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_name_key UNIQUE (name);


--
-- TOC entry 5699 (class 2606 OID 17483)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (location_id);


--
-- TOC entry 5715 (class 2606 OID 17594)
-- Name: references references_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_pkey PRIMARY KEY (reference_id);


--
-- TOC entry 5709 (class 2606 OID 17551)
-- Name: sources sources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (source_id);


--
-- TOC entry 5703 (class 2606 OID 17515)
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- TOC entry 5705 (class 2606 OID 17513)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (tag_id);


--
-- TOC entry 5707 (class 2606 OID 17520)
-- Name: tale_tags tale_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tale_tags
    ADD CONSTRAINT tale_tags_pkey PRIMARY KEY (tale_id, tag_id);


--
-- TOC entry 5701 (class 2606 OID 17499)
-- Name: tales tales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tales
    ADD CONSTRAINT tales_pkey PRIMARY KEY (tale_id);


--
-- TOC entry 5721 (class 2606 OID 17581)
-- Name: group_members group_members_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id) NOT VALID;


--
-- TOC entry 5722 (class 2606 OID 17576)
-- Name: group_members group_members_tale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_tale_id_fkey FOREIGN KEY (tale_id) REFERENCES public.tales(tale_id);


--
-- TOC entry 5720 (class 2606 OID 17566)
-- Name: groups groups_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sources(source_id);


--
-- TOC entry 5723 (class 2606 OID 17595)
-- Name: references references_from_tale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_from_tale_id_fkey FOREIGN KEY (from_tale_id) REFERENCES public.tales(tale_id);


--
-- TOC entry 5724 (class 2606 OID 17610)
-- Name: references references_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sources(source_id) NOT VALID;


--
-- TOC entry 5725 (class 2606 OID 17605)
-- Name: references references_to_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_to_group_id_fkey FOREIGN KEY (to_group_id) REFERENCES public.groups(group_id) NOT VALID;


--
-- TOC entry 5726 (class 2606 OID 17600)
-- Name: references references_to_tale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_to_tale_id_fkey FOREIGN KEY (to_tale_id) REFERENCES public.tales(tale_id);


--
-- TOC entry 5718 (class 2606 OID 17526)
-- Name: tale_tags tale_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tale_tags
    ADD CONSTRAINT tale_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(tag_id) ON DELETE CASCADE;


--
-- TOC entry 5719 (class 2606 OID 17521)
-- Name: tale_tags tale_tags_tale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tale_tags
    ADD CONSTRAINT tale_tags_tale_id_fkey FOREIGN KEY (tale_id) REFERENCES public.tales(tale_id) ON DELETE CASCADE;


--
-- TOC entry 5716 (class 2606 OID 17500)
-- Name: tales tales_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tales
    ADD CONSTRAINT tales_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(location_id);


--
-- TOC entry 5717 (class 2606 OID 17552)
-- Name: tales tales_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tales
    ADD CONSTRAINT tales_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sources(source_id) NOT VALID;


-- Completed on 2025-07-15 23:05:44

--
-- PostgreSQL database dump complete
--

