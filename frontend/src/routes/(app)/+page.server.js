/**
 * Dashboard Page - API Version
 *
 * Migrated from Prisma to Django REST API
 * Django endpoint: GET /api/dashboard/
 *
 * To activate:
 *   mv +page.server.js +page.server.prisma.js
 *   mv +page.server.api.js +page.server.js
 */

import { apiRequest } from '$lib/api-helpers.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, cookies }) {
  const userId = locals.user?.id;
  const org = locals.org;

  if (!userId || !org) {
    return {
      error: 'User not authenticated'
    };
  }

  try {
    // Fetch dashboard data from Django API
    console.log('Fetching dashboard data from API');
    const dashboardResponse = await apiRequest('/dashboard/', {}, { cookies, org });

    // Django returns:
    // {
    //   accounts_count, contacts_count, leads_count, opportunities_count,
    //   accounts: [], contacts: [], leads: [], opportunities: []
    // }

    // Transform recent leads - optimized
    const recentLeads = [];
    const leads = dashboardResponse.leads || [];
    for (let i = 0; i < Math.min(5, leads.length); i++) {
      const lead = leads[i];
      recentLeads.push({
        id: lead.id,
        firstName: lead.first_name,
        lastName: lead.last_name,
        company: lead.company?.name || null,
        status: lead.status,
        createdAt: lead.created_on
      });
    }

    // Transform recent opportunities - optimized
    const recentOpportunities = [];
    const opportunities = dashboardResponse.opportunities || [];
    let opportunityRevenue = 0;
    for (let i = 0; i < opportunities.length; i++) {
      const opp = opportunities[i];
      // Calculate revenue while iterating
      if (opp.amount) {
        opportunityRevenue += parseFloat(opp.amount);
      }
      // Add to recent opportunities if within limit
      if (i < 5) {
        recentOpportunities.push({
          id: opp.id,
          name: opp.name,
          amount: opp.amount ? parseFloat(opp.amount) : null,
          currency: opp.currency || null,
          stage: opp.stage,
          probability: opp.probability ? parseFloat(opp.probability) : null,
          createdAt: opp.created_on,
          closed_on: opp.closed_on,
          account: opp.account
            ? {
                name: opp.account.name
              }
            : null
        });
      }
    }

    // Tasks and activities now come from dashboard response (no separate API calls)
    // Transform tasks from dashboard response - optimized
    const upcomingTasks = [];
    const tasks = dashboardResponse.tasks || [];
    for (const task of tasks) {
      const isAssignedToUser = task.assigned_to && task.assigned_to.some((id) => id === userId);
      const isNotCompleted = task.status !== 'Completed';
      if (isAssignedToUser && isNotCompleted) {
        upcomingTasks.push({
          id: task.id,
          subject: task.title,
          status: task.status,
          priority: task.priority,
          dueDate: task.due_date
        });
        // Limit to 5 tasks
        if (upcomingTasks.length >= 5) {
          break;
        }
      }
    }

    // Transform activities from dashboard response - optimized
    const recentActivities = [];
    const activities = dashboardResponse.activities || [];
    for (const activity of activities) {
      recentActivities.push({
        id: activity.id,
        user: {
          name: activity.user?.name || activity.user?.email?.split('@')[0] || 'Unknown'
        },
        action: activity.action,
        entityType: activity.entity_type,
        entityId: activity.entity_id,
        entityName: activity.entity_name,
        description:
          activity.description ||
          `${activity.action_display} ${activity.entity_type}: ${activity.entity_name}`,
        timestamp: activity.timestamp,
        humanizedTime: activity.humanized_time
      });
    }

    // Count pending tasks for the user
    const pendingTasks = upcomingTasks.length;

    // Transform hot leads from new API response - optimized
    const hotLeads = [];
    const hotLeadsData = dashboardResponse.hot_leads || [];
    for (const lead of hotLeadsData) {
      hotLeads.push({
        id: lead.id,
        first_name: lead.first_name,
        last_name: lead.last_name,
        company: lead.company,
        rating: lead.rating,
        next_follow_up: lead.next_follow_up,
        last_contacted: lead.last_contacted
      });
    }

    return {
      metrics: {
        totalLeads: dashboardResponse.leads_count || 0,
        totalOpportunities: dashboardResponse.opportunities_count || 0,
        totalAccounts: dashboardResponse.accounts_count || 0,
        totalContacts: dashboardResponse.contacts_count || 0,
        pendingTasks: pendingTasks,
        opportunityRevenue: opportunityRevenue
      },
      recentData: {
        leads: recentLeads,
        opportunities: recentOpportunities,
        tasks: upcomingTasks,
        activities: recentActivities
      },
      // NEW: Enhanced dashboard data
      urgentCounts: dashboardResponse.urgent_counts || {
        overdue_tasks: 0,
        tasks_due_today: 0,
        followups_today: 0,
        hot_leads: 0
      },
      pipelineByStage: dashboardResponse.pipeline_by_stage || {},
      revenueMetrics: dashboardResponse.revenue_metrics || {
        pipeline_value: 0,
        weighted_pipeline: 0,
        won_this_month: 0,
        conversion_rate: 0
      },
      hotLeads: hotLeads
    };
  } catch (error) {
    console.error('Dashboard load error:', error);
    return {
      error: 'Failed to load dashboard data'
    };
  }
}
