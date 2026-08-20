import React from 'react';
import type { Metadata } from 'next';
import ServicesSection from '@/components/ServicesSection';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: "Our Flooring Services | ZK Flooring Birmingham",
  description: "Explore ZK Flooring's comprehensive installation services: Carpet fitting, LVT, hardwood, laminate, SPC flooring, and subfloor prep in Birmingham.",
};

import { defaultZkServices } from '@/components/ServicesSection';

export default async function ServicesPage() {
  const { data: dbServices } = await supabase.from('services').select('*').order('created_at', { ascending: false });
  const flooringServices = dbServices && dbServices.length > 0 ? dbServices : defaultZkServices;

  return (
    <main>
      {/* Start Breadcrumb Section */}
      <section className="tv-breadcrumb-section">
        <div className="tv-breadcrumb-inner mx-30 ml-mx-0 position-relative overflow-hidden br-30 ml-br-0" style={{ background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' }}><div className="bg"></div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="title-outer">
                  <div className="page-title">
                    <h2 className="title">Our Services</h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> Services</li>
                    </ul>
                  </div>
                  <div className="image-box md-d-none">
                    <div className="shapes">
                      <div className="shape shape-1"><img src="/assets/images/shapes/circle.webp" alt="" /></div>
                      <div className="shape shape-2 spin2"><img src="/assets/images/shapes/star.webp" alt="" /></div>
                      <div className="shape shape-3"><img src="/assets/images/shapes/snake.webp" alt="" /></div>
                      <div className="shape shape-4 jump3"><img src="/assets/images/shapes/doot.webp" alt="" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - reuses same component as home page */}
      <ServicesSection flooringServices={flooringServices} />

    </main>
  );
}
