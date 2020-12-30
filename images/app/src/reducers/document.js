/* eslint-disable max-len */

import { nextLine, prevLine } from '../actions/navigateDocument'
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  current: 2,
  lines: [
    'Task Area 1:',
    'a. Design solutions toward the end user experience so that products produced meet end user goals and measure of success as well as the strategic business objectives of the providing organization.',
    'b. Work with stakeholders and technology professionals to properly understand business requirements and develop an industry best practice approach to technology solutions.',
    'c. Develop, test, stage, and release business applications by applying iterative processes utilizing the agile methodologies and a frequent release cycle.',
    'd. Provide customer-friendly open source solutions that provide ease of use for non- technical Government users.',
    'e. Provide in depth, advanced analytics (for example predictive modeling and geospatial analytics and mapping) to support the development processes which may require a new measure or report to refine or expand an existing measure to generate a different outcome using CMS approved tools.',
    'f. Perform data extraction to design and execute a query based on parameters prescribed by the requestor and generate a file that includes resultant dataset.',
    'g. Provide subject matter expertise for the respective coding language.',
    'h. Provide subject matter expertise for the given underlying business application (for example, experience/knowledge of CMS Part B claims data and healthcare datasets).',
    'i. Ensure commercial best practices workflows shall come bundled with the solutions.',
    'j. Design solutions that offer role based identity management, authorization, and authentication across all business applications.',
    'Task Area 2:',
    'a. Provide database architecture subject matter expertise for the respective platforms.',
    'b. Include database performance and impact in all system design or development efforts to ensure industry best practices are supported.',
    'c. Work with third-party cloud encryption gateway technologies, if present, provided by the government to secure designated data while in transit to/from the cloud as well as at rest.',
    'd. Work with security in the creation of policy and/or procedures surrounding data implementation including the correction of application security vulnerabilities within 24 hours.',
    'e. Verify in writing to the Government that data migrated from any legacy system to the new modernized application is complete and accurate in accordance with the Federal Records Act and any other applicable federal law, according to the agreed upon framework coordinated with Agency and the Contractor, and that all data is accessible.',
    'f. Be knowledgeable in data warehousing, data visualization and business intelligence best practices to provide guidance on data architecture and mapping.',
    'g. Provide systems and data integration and orchestration services between legacy and other systems of record or data warehouses.',
    'h. Support Clinical Quality technologies (ex. Health Care Quality Information Systems, Big-data) such as machine learning and data warehousing.',
    'i. Establish data governance processes and artifacts to document and communicate the source and meaning of the data being stored.',
    'Task Area 3:',
    'a. Find ways to permit and encourage a “one team” attitude at every level, including across BPA holders and other contractors.',
    'b. Exercise regular coordination between contractors/product teams working on related projects and stress the ability to perform successful combined planning.',
    'c. Facilitate effective communications through single set of tools (e.g. Atlassian, Slack, unified monitoring, etc.).',
    'd. Give periodic project, program, and operational status updates as required by the government within an agreed-upon frequency and schedule. These are typically weekly or monthly task order status reports or roadmap reviews, and/or daily/weekly Agile/Scrum development meetings.',
    'e. For larger CMS programs utilizing SAFe Agile; participate in product owner syncs, release train syncs, and feature definition and refinement sessions as required.  Participate in system demos to showcase production ready functionality at the end of each sprint.  Attend program increment planning events every 10-12 weeks (all teams, all members).',
    'f. Conduct periodic retrospectives of recent team efforts to identify lessons learned, both good and bad that can be incorporated into future work efforts.',
    'g. Provide on-site project management support and attend in-person meetings on an ad- hoc basis.',
    'h. As part of the IT Governance support, provide enterprise-wide platform architectural design, centralized design review of configuration and code prior to release, and support of the most current CMS application implementation best practices, features and functions.',
    'i. Provide project and operational documentation as required by the government to support specific project deliverables or ongoing operational support such as Security Authority to Operate.',
    'j. Manage and oversee daily, weekly, and monthly workloads and schedule for active tasks with regard to schedule, budget, priority, risk, and quality to ensure quality response to government task order requests.',
    'k. Provide programmatic support for the agency’s IT Governance or governing body, including but not limited to application portfolio management and engagement with Enterprise Architecture, developing strategic roadmaps, creation of executive-level briefings, support in developing OMB capital planning reports, managing the new request intake (currently NWRP), Lean Portfolio Management (LPM), and governance process, license management, and facilitating recurring program meetings.',
    'l. Provide team-based foundational training on principles and practices of Agile Software Development and Lean.',
    'm. Provide tailored Agile coaching, product owner and agile team support, in the agency’s specific context at the team and project level, including mentoring and co-facilitation of ceremonies for the project leaders and development team through a project/iteration life cycle.',
    'n. Provide Agile Portfolio Management support to provide decision support for portfolio- level planning in order to make it easier to track status of cross-project initiatives by maintaining alignment between Agile strategy and execution.',
    'o. Provide Agile training support, having certified Agile experts consult on the right-sized Agile methodology (SAFE, Scrum, DAD, etc.) and implementation strategy for an agency\'s current maturity level and program needs.',
    'p. Coach on technical practices and release management standards in an Agile organization.',
    'q. Analyze alternatives and recommend Agile tools for possible implementation in an Agile development enterprise.',
    'r. Develop, utilize, and maintain process flow diagrams, guidelines and other reference materials to assist in troubleshooting problems and resolving outages quickly.',
    's. Provide role-based training solutions for users to become proficient in the business applications, including content creation, content maintenance, review, and approval processes.',
    't. Provide “train-the-trainer” solutions and product demonstrations to stakeholders and support staff.',
    'u. Contribute to program related external community communication material as needed.',
    'v. Create, update, or revise and review knowledge management practices, procedures, or documents.',
    'w. Maintain the right level of documentation of products and services to be able to address FAQs from other developers/analysts (e.g. a no-frills document explaining a specific database, that might include a schema, data dictionary, source-to-target mapping, any data transformations or derived columns), as a means to increase transparency and avoid recurring questions, and prepare for succession planning.',
    'x. Assist with responding to technical inquiries received from the help desk or stakeholders.',
    'Task Area 4:',
    'a. Ensure high emphasis on simple implementations to solutions over complex implementations.',
    'b. Utilize an “API First” development approach to ensure higher levels of system interoperability.',
    'c. Use of open source products over COTS solutions whenever possible.',
    'd. Apply Human-Centered Design (HCD) principals for enhanced user experience and usability of systems.',
    'e. Identify usability issues and craft solutions to resolve bug fixes or other performance problems.',
    'f. Advise and provide recommendations of how new manufacturer-driven updates of the platform shall be affected or upgraded according to manufacturer release schedules.',
    'g. Build an agile, iterative release schedule to rapidly deploy new versions of the software on cloud environment so that developers can quickly fix problems and provide improvements.',
    'h. Support full parallelization and scaling on standardized commercial cloud infrastructure.',
    'i. Automate deployment of infrastructure services using techniques like IaC (Infrastructure as Code).',
    'j. Monitor cloud services usage for optimal utilization, reduced waste and better overall cloud cost savings.',
    'k. Maximize deployment and maintenance of a system with zero-downtime and no planned outages.',
    'l. Provide enterprise-wide release management support for large and/or complex monthly (or more frequent) releases, configuration changes, and out-of-cycle emergency releases of code and configuration to higher environments, including production.',
    'm. Provide enterprise-wide release management support for incremental feature releases as frequent as daily, configuration changes, and expedited code changes from development through production environments.',
    'n. Provide development environment management expertise, regression testing, and continuous integration management including the administration of the systems and tools that are used as part of that process.',
    'o. Utilize an issue tracking system designated and hosted by the government, unless otherwise proposed and provided by the Contractor.',
    'p. Utilize automated tools for preserving data integrity, detecting anomalous data inputs or outputs.',
    'q. Monitor system-level resource utilization and performance in real-time (e.g. response time, latency, throughput, and error rates).',
    'r. Ensure monitoring can measure median, 95th percentile, and 98th percentile performance, and create automated alerts based on this monitoring to improve insight into systems.',
    's. Track concurrent users in real-time, and monitor user behaviors in the aggregate to determine how well the service meets user needs.',
    't. Provide reporting and metrics on issue tracking and resolution.',
    'u. Provide education and outreach communications to end users and their organizations.',
    'v. Act as an escalation point for break/fix items as reported by the government or users. This may require working with end users and the platform vendor as necessary to define, document, test, and address issues.',
    'w. Identify, manage, triage, resolve and conduct post-mortem of system, security and operational incidents per the CMS Contingency Planning and Incident Response plan.',
    'x. Support Service Center/Help Desk to address technical user inquiries/issues related to systems.',
    'y. Plan for disaster recovery and periodically test the disaster recovery plan.',
    'z. Building automated mechanisms for turning on and off functional features of the systems without requiring new build and release of the system by utilizing feature flags or similar techniques.',
    'aa. Create and verify release checklists prior to deployments and system releases to ensure all required tasks related to code quality, security, usability, monitoring, logging, performance and functional validation has been completed.',
    'bb. Create automated and continuous integration, deployment, and checklists verification using CI/CD mechanism.',
    'cc. Providing comprehensive code coverage with automated unit, integration, and end- to-end testing to enable rapid development without introducing bugs.',
    'dd. Create step-by-step production deployment runbook identifying all activities, activity owners, and date/time of the execution of each steps of the deployment including a rollback plan.',
    'ee. Major production releases must include launch plan to identify all activities related to the product launch including but not limited to: Service Center/Help Desk communication, training and coordination, stakeholder communication, end user education and outreach materials, applicable trainings, user guides, demo recordings, and formal internal and external announcements scripts and dissemination mechanism.',
    'ff. Development and maintenance of application security documentation including documentation in support of achieving an Authority to Operate (ATO).'
  ],
  tagged: {
    3: [ 'develop', 'code', 'test' ]
  }
}

export const documentSlice = createSlice( {
  name: 'document',
  initialState,
  reducers: {},
  extraReducers: {
    [nextLine]: state => {
      state.current += 1;
      if ( state.current >= state.lines.length ) {
        state.current = state.lines.length - 1;
      }
      return state
    },
    [prevLine]: state => {
      state.current -= 1;
      if ( state.current < 0 ) {
        state.current = 0
      }
      return state
    }
  }
} );

export default documentSlice.reducer;
