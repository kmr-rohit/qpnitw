import Link from 'next/link'
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "supabase.config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchDepartments() {
  console.log("fetching departments");
  let { data: departments, error } = await supabase
    .from('departments')
    .select('id, name , slug');
  console.log(departments);
  console.log(error);
  return { data: departments, error: error };
}

const departmentNames = [];
  const departments = await fetchDepartments();
  departments.data.map(department => {
    let dept = {};
    dept.name = department.name;
    dept.slug = department.slug;
    departmentNames.push(dept);
  })


export default function Home() {
  
  return (
  <main className="flex min-h-screen flex-col items-center p-24">
    <div className="text-4xl font-bold text-center">Departments</div>
    <ul className="text-center m-4">
      {departmentNames.map((dept, index) => (
        <li className='text-2xl text-center m-2 p-2' key={index}>
          <Link href={`/department/${dept.slug}`}>
            {dept.name}
          </Link>
        </li>
      ))}
    </ul>
  </main>
  )
}
