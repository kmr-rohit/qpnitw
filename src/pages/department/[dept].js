import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { createClient } from "@supabase/supabase-js";
import {SUPABASE_URL , SUPABASE_KEY} from "supabase.config.js";
import 'tailwindcss/tailwind.css';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function Department() {
  const router = useRouter()
  const { dept } = router.query || {};
  const [Courses, setCourses] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isOpenCourse, setIsOpenCourse] = useState(false);
  const [isOpenSection, setIsOpenSection] = useState(false);
  const [papers, setPapers] = useState([]); // Add this line to define the state for papers



  
  useEffect(() => {
    if (dept) {
      fetchCourses(dept);
    }
  }, [dept]);

  async function fetchCourses(dept) {
    let { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', dept)

    if (error) console.error(error);
    else {
      console.log(courses)
      setCourses(courses);
    }

  }
  async function fetchPapers(course_id ,section) {
    let section_slug = "";
    if(section == 'End Semester Exams'){
      section_slug = 'end';
    }
    else if(section == 'Mid Semester Exams'){
      section_slug == 'mid'
    }
    else{
      section_slug = "minor"
    }
    console.log(course_id);
    console.log(section_slug);
    let { data: papers, error } = await supabase
      .from('papers')
      .select('*')
      .eq('course_id', course_id )
      .eq('category' , section_slug)
  
    if (error) console.error(error);
    else {
      console.log(papers)
      return papers;
    }
  }

  if (!Courses) return <div>Loading...</div>;

  const sections = ['End Semester Exams', 'Mid Semester Exams', 'Minor Exams'];

  
  return (
    <main className="flex flex-col p-10 bg-gray-900 text-white">
    <div className="text-4xl font-bold text-center mb-8">Courses</div>
    <ul className="text-center m-4 space-y-4">
      <p className="text-red-300 text-3xl mb-4">Only use Student Mail address to view papers</p>
      <div className='text-white'>
      {Courses.map((course, index) => (
        <li 
          className='text-2xl text-center m-2 p-2 rounded shadow ' 
          key={index}
          onClick={() => {
            setSelectedCourse(course);
            setIsOpenCourse(selectedCourse === course ? !isOpenCourse : true);
            setSelectedSection(null);
            setIsOpenSection(false);
          }}
        >
          {course.course_name}
          {isOpenCourse && selectedCourse === course && (
            <ul className="space-y-2 text-2xl text-left ml-10 p-2 rounded shadow">
              {sections.map((section, index) => (
                <li key={index} onClick={async (e) => {
                  e.stopPropagation(); // Prevent the course click event from firing
                  setSelectedSection(section);
                  setIsOpenSection(selectedSection === section ? !isOpenSection : true);
                  const papers = await fetchPapers(selectedCourse.id , section );
                  setPapers(papers);
                }}
                className="rounded shadow "
                >
                  {section}
                  {isOpenSection && selectedSection === section && (
                    <ul className="space-y-2 text-xl ml-4 text-red">
                    {papers.map((paper, index) => {
                      let ppr_name = `${selectedCourse.course_name} ${selectedSection} ${paper.year}`;
                      return (
                        <li key={index} className="rounded shadow ">
                          <span>{index + 1}. </span>
                          <a href={paper.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200">
                            {ppr_name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
      </div>
    </ul>
  </main>
  )
}