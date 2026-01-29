// Results Calculation and Display

class ResultsManager {
    constructor(scores) {
        this.scores = scores;
        this.strengths = [];
        this.development = [];
        this.categorizeScores();
    }

    categorizeScores() {
        Object.entries(this.scores).forEach(([layerId, data]) => {
            if (data.score >= 4.0) {
                this.strengths.push({ layerId, ...data });
            } else if (data.score < 4.0) {
                this.development.push({ layerId, ...data });
            }
        });
        
        // Sort development areas by priority (lowest score first)
        this.development.sort((a, b) => a.score - b.score);
    }

    displayResults() {
        this.renderChart();
        this.renderStrengths();
        this.renderDevelopmentAreas();
        this.renderActionSteps();
    }

    renderChart() {
        const ctx = document.getElementById('results-chart').getContext('2d');
        
        const labels = Object.values(this.scores).map(s => s.name);
        const data = Object.values(this.scores).map(s => s.score);
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Your Score',
                    data: data,
                    backgroundColor: 'rgba(139, 0, 0, 0.2)',
                    borderColor: 'rgba(139, 0, 0, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(139, 0, 0, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(139, 0, 0, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    renderStrengths() {
        const container = document.getElementById('strengths-list');
        container.innerHTML = '';
        
        if (this.strengths.length === 0) {
            container.innerHTML = '<p>Continue building all foundational layers. Every area shows opportunity for growth.</p>';
            return;
        }
        
        this.strengths.forEach(strength => {
            const div = document.createElement('div');
            div.className = 'layer-result strength';
            div.innerHTML = `
                <h3>Layer ${strength.layerId}: ${strength.name}</h3>
                <p class="layer-score">Score: ${strength.score.toFixed(1)}/5.0</p>
                <p>${strength.description}</p>
            `;
            container.appendChild(div);
        });
    }

    renderDevelopmentAreas() {
        const container = document.getElementById('development-list');
        container.innerHTML = '';
        
        if (this.development.length === 0) {
            document.getElementById('development-section').style.display = 'none';
            return;
        }
        
        this.development.forEach((area, index) => {
            const div = document.createElement('div');
            div.className = 'layer-result development';
            
            let priority = '';
            if (index === 0) priority = ' - <strong>Priority 1</strong>';
            else if (index === 1) priority = ' - <strong>Priority 2</strong>';
            else if (index === 2) priority = ' - <strong>Priority 3</strong>';
            
            div.innerHTML = `
                <h3>Layer ${area.layerId}: ${area.name}${priority}</h3>
                <p class="layer-score">Score: ${area.score.toFixed(1)}/5.0</p>
                <p>${area.description}</p>
            `;
            container.appendChild(div);
        });
    }

    renderActionSteps() {
        const container = document.getElementById('action-steps-container');
        container.innerHTML = '';
        
        // Show action steps for top 3 development priorities
        const priorities = this.development.slice(0, 3);
        
        priorities.forEach((area, index) => {
            const actionPlan = this.getActionPlan(area.layerId);
            
            const section = document.createElement('div');
            section.className = 'priority-section';
            section.innerHTML = `
                <h3>Priority ${index + 1}: ${area.name} (${area.score.toFixed(1)}/5.0)</h3>
                ${actionPlan.context}
                <h4>Action Steps:</h4>
                <ol>
                    ${actionPlan.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
                ${actionPlan.resources ? `
                    <h4>Resources:</h4>
                    <ul>
                        ${actionPlan.resources.map(resource => `<li>${resource}</li>`).join('')}
                    </ul>
                ` : ''}
                <p class="timeline"><strong>Expected Timeline:</strong> ${actionPlan.timeline}</p>
            `;
            container.appendChild(section);
        });
        
        if (priorities.length === 0) {
            container.innerHTML = '<p>Great work! Focus on maintaining your strengths and continuing to refine all areas.</p>';
        }
    }

    getActionPlan(layerId) {
        const actionPlans = {
            1: {
                context: '<p>Technical credibility is the foundation of everything else. Without it, students won\'t trust your instruction.</p>',
                steps: [
                    '<strong>Schedule dedicated personal training time</strong> (3-5 hours/week) separate from teaching',
                    '<strong>Video yourself demonstrating core techniques</strong> and review for errors',
                    '<strong>Seek monthly feedback</strong> from a senior instructor or training partner',
                    '<strong>Study biomechanics/kinesiology</strong> relevant to FMA movements',
                    '<strong>Attend seminars or workshops</strong> to expose gaps in your technical knowledge'
                ],
                resources: [
                    'Record and review your solo training sessions',
                    'Find a senior practitioner for monthly check-ins',
                    'Study resources on human movement and body mechanics'
                ],
                timeline: '3-6 months to see measurable improvement'
            },
            2: {
                context: '<p>You may have the skill, but can you transmit it effectively? Teaching is a separate competency that must be developed deliberately.</p>',
                steps: [
                    '<strong>Practice explaining the same concept three different ways</strong> (visual, kinesthetic, analytical)',
                    '<strong>Give specific feedback</strong> - replace "good" with "your elbow angle improved from 45° to 30°"',
                    '<strong>Diagnose root causes</strong> - when students struggle, identify if it\'s physical, mental, or conceptual',
                    '<strong>Study pedagogy</strong> - read books or take courses on teaching and learning theory',
                    '<strong>Watch yourself teach</strong> - record classes and analyze your delivery'
                ],
                resources: [
                    'Read: "The Inner Game of Tennis" by Timothy Gallwey',
                    'Read: "How Learning Works" by Susan Ambrose',
                    'Observe skilled teachers in other disciplines'
                ],
                timeline: '2-4 months to see improvement in student comprehension'
            },
            3: {
                context: '<p>Students respond to instructors who are steady, humble, and focused on their growth. Emotional maturity creates safety and trust.</p>',
                steps: [
                    '<strong>Practice emotional regulation</strong> - notice when you feel defensive or reactive, and pause',
                    '<strong>Admit mistakes openly</strong> - model humility by acknowledging when you\'re wrong',
                    '<strong>Prioritize student growth over ego</strong> - ask yourself "is this about helping them or proving myself?"',
                    '<strong>Seek personal development</strong> - therapy, coaching, or spiritual practice',
                    '<strong>Get feedback on your behavior</strong> - ask trusted students or peers how you show up'
                ],
                resources: [
                    'Consider working with a therapist or coach',
                    'Practice mindfulness or meditation',
                    'Read: "Ego is the Enemy" by Ryan Holiday'
                ],
                timeline: 'Ongoing - maturity is a lifelong practice'
            },
            4: {
                context: '<p>Retention problems often stem from misalignment. When students don\'t know what they\'re signing up for, they leave confused.</p>',
                steps: [
                    '<strong>Write your training philosophy</strong> - who is this for? What do you value? What won\'t you compromise?',
                    '<strong>Create a clear mission statement</strong> - make it visible on your website and in your space',
                    '<strong>Pre-screen new students</strong> - have a conversation before they join to assess alignment',
                    '<strong>Communicate values regularly</strong> - remind students what the program stands for',
                    '<strong>Be willing to say no</strong> - not every student is a good fit, and that\'s okay'
                ],
                resources: [
                    'Examples of clear training philosophies from other schools',
                    'New student intake questionnaire template',
                    'Mission statement worksheet'
                ],
                timeline: '1-2 weeks to clarify, ongoing to implement'
            },
            5: {
                context: '<p>Students need to know where they are and where they\'re going. Combine clear curriculum with reliable operations.</p>',
                steps: [
                    '<strong>Document your curriculum</strong> - map out 6-12 month progression with milestones',
                    '<strong>Create a student-facing roadmap</strong> - visual guide showing progression paths',
                    '<strong>Systemize operations</strong> - set up consistent class times, communication channels, payment systems',
                    '<strong>Track attendance</strong> - use a simple spreadsheet or app',
                    '<strong>Follow up with absent students</strong> - reach out after 2+ missed sessions',
                    '<strong>Review curriculum quarterly</strong> - assess what\'s working and adjust'
                ],
                resources: [
                    'FMA curriculum design template',
                    'Student progress tracking spreadsheet',
                    'Class communication protocol template',
                    'Recommended tools: Google Sheets, WhatsApp/Discord, Stripe'
                ],
                timeline: '3-4 weeks to establish, ongoing to maintain'
            },
            6: {
                context: '<p>Students stay when they feel they belong. Community is built through intentional stewardship, not just training together.</p>',
                steps: [
                    '<strong>Create community-building opportunities</strong> - post-class gatherings, special events, group challenges',
                    '<strong>Encourage peer mentorship</strong> - pair senior students with newer ones',
                    '<strong>Model the values you teach</strong> - demonstrate humility, respect, service',
                    '<strong>Facilitate connection</strong> - create a group chat or forum for students',
                    '<strong>Recognize contributions</strong> - acknowledge when students help each other or the community',
                    '<strong>Host regular gatherings</strong> - potlucks, seminars, demonstrations'
                ],
                resources: [
                    'Community-building activity ideas',
                    'Senior student mentorship structure template',
                    'Event planning checklist'
                ],
                timeline: '1-3 months to establish culture, ongoing to maintain'
            },
            7: {
                context: '<p>Not all students are meant to stay long-term. Understanding their goals and commitment helps you serve them better and know when to let go.</p>',
                steps: [
                    '<strong>Have goal-setting conversations</strong> - ask students what they want from training',
                    '<strong>Assess commitment levels</strong> - understand who\'s here for life vs. trying it out',
                    '<strong>Encourage self-accountability</strong> - students should track their own progress and set personal goals',
                    '<strong>Address misalignment directly</strong> - if someone isn\'t thriving, have an honest conversation',
                    '<strong>Let go gracefully</strong> - some students will leave, and that\'s natural',
                    '<strong>Cultivate serious practitioners</strong> - invest most energy in aligned, committed students'
                ],
                resources: [
                    'Student goal-setting worksheet',
                    'New student intake questions',
                    'Commitment level assessment framework'
                ],
                timeline: '1-2 months to implement, ongoing practice'
            },
            8: {
                context: '<p>Leadership isn\'t something you claim - it\'s recognized by students when you embody competence, care, and consistency across all layers.</p>',
                steps: [
                    '<strong>Lead by example</strong> - model the behavior, values, and commitment you expect',
                    '<strong>Serve, don\'t command</strong> - view leadership as stewardship, not authority',
                    '<strong>Stay humble</strong> - acknowledge your ongoing growth and learning',
                    '<strong>Build trust through consistency</strong> - show up reliably in skill, character, and care',
                    '<strong>Mentor, don\'t just instruct</strong> - invest in students\' growth beyond technique',
                    '<strong>Strengthen all other layers</strong> - leadership emerges when the foundations are strong'
                ],
                resources: [
                    'Re-take this assessment in 6 months to track progress',
                    'Seek feedback from trusted students and peers',
                    'Study examples of servant leadership in martial arts'
                ],
                timeline: 'Ongoing - leadership is the outcome of sustained excellence'
            }
        };
        
        return actionPlans[layerId] || {
            context: '<p>Focus on building this foundational layer.</p>',
            steps: ['Revisit the questions in this section and identify specific areas to develop'],
            timeline: 'Ongoing'
        };
    }
}
