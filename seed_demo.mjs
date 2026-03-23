import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Logging in as recruiter@test.com...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'recruiter@test.com',
    password: 'Password123!',
  });

  if (authError || !authData.user) {
    console.error('Login failed:', authError?.message);
    process.exit(1);
  }

  // Get company
  const { data: companyUsers, error: cuError } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', authData.user.id);

  if (cuError || !companyUsers?.length) {
    console.error('No company linked to user:', cuError?.message);
    process.exit(1);
  }

  const companyId = companyUsers[0].company_id;
  console.log(`Company ID found: ${companyId}`);

  // 1. Update company details
  await supabase
    .from('companies')
    .update({
      name: 'Meridian Technologies',
      description: 'Building the infrastructure of tomorrow, today.',
    })
    .eq('id', companyId);

  // 2. Update theme
  await supabase
    .from('company_themes')
    .update({
      primary_color: '#4f46e5', // Indigo-600
      font_family: 'Inter',
      hero_title: 'Shape the Future of Enterprise with Us',
      hero_subtitle: 'Join a world-class team of engineers, designers, and visionaries building scalable tech solutions for millions.',
    })
    .eq('company_id', companyId);

  // 3. Update sections
  const sections = [
    {
      company_id: companyId,
      section_type: 'about',
      content: {
        title: 'Our Mission & Story',
        description: 'Founded in 2018, Meridian Technologies has quickly grown from a small passionate team into a global leader in cloud infrastructure. We believe that technology should empower businesses to innovate freely without limits. We are headquartered in San Francisco with remote hubs across the world.',
        images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'],
      },
      is_visible: true,
      order_index: 0,
    },
    {
      company_id: companyId,
      section_type: 'culture',
      content: {
        title: 'Life at Meridian',
        description: 'We prioritize a balanced, collaborative, and inclusive culture where everyone brings their authentic self to work.',
        images: [
          'https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
      },
      is_visible: true,
      order_index: 1,
    },
    {
      company_id: companyId,
      section_type: 'values',
      content: {
        title: 'Our Core Values',
        description: 'The principles that guide every decision we make.',
        items: [
          { id: '1', title: 'Start with the User', description: 'We build products that solve real problems for our customers.', icon: '🎯' },
          { id: '2', title: 'Ownership & Agency', description: 'Be the CEO of your own domain. We trust our people to execute.', icon: '🚀' },
          { id: '3', title: 'Continuous Growth', description: 'We never stop learning. We adapt, experiment, and constantly evolve.', icon: '🌱' },
          { id: '4', title: 'Radical Candor', description: 'We speak the truth with empathy, fostering open and honest communication.', icon: '💬' },
        ],
      },
      is_visible: true,
      order_index: 2,
    },
    {
      company_id: companyId,
      section_type: 'benefits',
      content: {
        title: 'World-Class Benefits',
        description: 'We take care of our own, providing comprehensive benefits so you can focus on building.',
        items: [
          { id: 'b1', title: 'Remote-First Options', description: 'Work from anywhere in the world with a flexible schedule.', icon: '🌍' },
          { id: 'b2', title: 'Comprehensive Health', description: '100% premium coverage for medical, dental, and vision.', icon: '❤️' },
          { id: 'b3', title: 'Learning Stipend', description: '$2,000 annual budget for courses, books, and conferences.', icon: '📚' },
          { id: 'b4', title: 'Generous Equity', description: 'Competitive stock options so you own a piece of our future.', icon: '📈' },
          { id: 'b5', title: 'Home Office Setup', description: '$1,000 stipend to furnish your ideal home working environment.', icon: '💻' },
          { id: 'b6', title: 'Unlimited PTO', description: 'Take the time you need to recharge, with a minimum 3-week requirement.', icon: '✈️' },
        ],
      },
      is_visible: true,
      order_index: 3,
    },
  ];

  console.log('Upserting sections...');
  for (const sec of sections) {
    await supabase
      .from('company_sections')
      .upsert(sec, { onConflict: 'company_id, section_type' });
  }

  // 4. Update jobs (Delete existing simple ones and add pro ones)
  console.log('Replacing jobs...');
  await supabase.from('jobs').delete().eq('company_id', companyId);

  const jobs = [
    {
      company_id: companyId,
      title: 'Senior Staff Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA (or Remote)',
      work_policy: 'Hybrid',
      employment_type: 'Full-time',
      experience_level: 'Senior',
      salary_range: '$180,000 - $250,000 + Equity',
      description: 'We are looking for a key engineering leader to architect our next-generation cloud infrastructure.',
      requirements: '- 8+ years experience in distributed systems\n- Proficiency in Go, Rust, or C++\n- Strong system design skills',
      is_active: true,
    },
    {
      company_id: companyId,
      title: 'Lead Product Designer',
      department: 'Design',
      location: 'New York, NY',
      work_policy: 'On-site',
      employment_type: 'Full-time',
      experience_level: 'Lead',
      salary_range: '$160,000 - $210,000',
      description: 'Lead the design vision for our flagship enterprise product, creating intuitive and beautiful B2B experiences.',
      requirements: '- 6+ years in SaaS product design\n- Master of Figma\n- Portfolio demonstrating complex systems simplified',
      is_active: true,
    },
    {
      company_id: companyId,
      title: 'Developer Advocate',
      department: 'Developer Relations',
      location: 'London, UK (or Remote EU)',
      work_policy: 'Remote',
      employment_type: 'Full-time',
      experience_level: 'Mid-Level',
      salary_range: '£80,000 - £120,000',
      description: 'Be the bridge between our engineering team and our open-source community.',
      requirements: '- Background in software engineering\n- Exceptional writing and technical communication skills\n- Active community presence',
      is_active: true,
    },
    {
      company_id: companyId,
      title: 'Enterprise Account Executive',
      department: 'Sales',
      location: 'Remote (US)',
      work_policy: 'Remote',
      employment_type: 'Full-time',
      experience_level: 'Senior',
      salary_range: '$150k Base / $300k OTE',
      description: 'Drive growth by partnering with Fortune 500 companies to transform their infrastructure.',
      requirements: '- 5+ years B2B SaaS sales experience\n- Track record of $2M+ quotas\n- Executive-level presentation skills',
      is_active: true,
    }
  ];

  await supabase.from('jobs').insert(jobs);

  console.log('Successfully seeded professional demo data!');
  process.exit(0);
}

seed();
