// Conditional imports for AI modules
let OpenAI, OpenAIEmbeddings, MemoryVectorStore, Document, RecursiveCharacterTextSplitter;

try {
  OpenAI = require('openai');
  const langchain = require('langchain');
  OpenAIEmbeddings = langchain.embeddings.openai.OpenAIEmbeddings;
  MemoryVectorStore = langchain.vectorstores.memory.MemoryVectorStore;
  Document = langchain.document.Document;
  RecursiveCharacterTextSplitter = langchain.text_splitter.RecursiveCharacterTextSplitter;
} catch (error) {
  console.log('⚠️ OpenAI/LangChain modules not available, using development mode');
}

class AIService {
  constructor() {
    this.openai = null;
    this.embeddings = null;
    this.courseDatabase = null;
    this.initialized = false;
    this.developmentMode = false;
  }

  /**
   * Initialize the AI service
   */
  async initialize() {
    try {
      console.log('🤖 Initializing AI service...');
      
      // Check if we should use development mode
      if (process.env.USE_DEVELOPMENT_AI === 'true' || 
          !process.env.OPENAI_API_KEY || 
          process.env.OPENAI_API_KEY === 'sk-demo-key-for-development') {
        this.developmentMode = true;
        console.log('🔧 Using development AI mode');
        await this.initializeDevelopmentMode();
        return;
      }
      
      // Initialize OpenAI
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
      this.embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
      
      // Load course database
      await this.loadCourseDatabase();
      
      // Test OpenAI connection
      await this.testConnection();
      
      this.initialized = true;
      console.log('✅ AI service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AI service:', error);
      console.log('🔄 Falling back to development mode');
      this.developmentMode = true;
      await this.initializeDevelopmentMode();
    }
  }

  /**
   * Initialize development mode with mock AI responses
   */
  async initializeDevelopmentMode() {
    console.log('🔧 Initializing development AI mode...');
    
    // Load course database
    await this.loadCourseDatabase();
    
    this.initialized = true;
    console.log('✅ Development AI mode initialized');
  }

  /**
   * Test OpenAI connection
   */
  async testConnection() {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10,
      });
      console.log('✅ OpenAI connection successful');
    } catch (error) {
      console.error('❌ OpenAI connection failed:', error);
      throw error;
    }
  }

  /**
   * Load course database for vector search
   */
  async loadCourseDatabase() {
    try {
      // Sample course data - in production, this would come from a database
      const courses = [
        {
          title: 'Introduction to Computer Science',
          institution: 'Harvard University',
          description: 'Fundamental concepts of computer science and programming',
          syllabus: 'Variables, data types, control structures, functions, algorithms, basic data structures',
          credits: 3,
          level: 'undergraduate',
          category: 'Computer Science',
        },
        {
          title: 'Data Structures and Algorithms',
          institution: 'Stanford University',
          description: 'Advanced data structures and algorithm analysis',
          syllabus: 'Arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, complexity analysis',
          credits: 4,
          level: 'undergraduate',
          category: 'Computer Science',
        },
        {
          title: 'Machine Learning Fundamentals',
          institution: 'MIT',
          description: 'Introduction to machine learning algorithms and applications',
          syllabus: 'Supervised learning, unsupervised learning, neural networks, deep learning, model evaluation',
          credits: 4,
          level: 'graduate',
          category: 'Artificial Intelligence',
        },
        {
          title: 'Calculus I',
          institution: 'UC Berkeley',
          description: 'Differential calculus and its applications',
          syllabus: 'Limits, continuity, derivatives, applications of derivatives, optimization',
          credits: 4,
          level: 'undergraduate',
          category: 'Mathematics',
        },
        {
          title: 'Linear Algebra',
          institution: 'University of Oxford',
          description: 'Vector spaces, linear transformations, and matrices',
          syllabus: 'Vectors, matrices, determinants, eigenvalues, eigenvectors, linear transformations',
          credits: 3,
          level: 'undergraduate',
          category: 'Mathematics',
        },
        {
          title: 'Probability and Statistics',
          institution: 'University of Cambridge',
          description: 'Probability theory and statistical inference',
          syllabus: 'Probability distributions, random variables, hypothesis testing, confidence intervals, regression',
          credits: 3,
          level: 'undergraduate',
          category: 'Mathematics',
        },
        {
          title: 'Database Systems',
          institution: 'Carnegie Mellon University',
          description: 'Database design, implementation, and management',
          syllabus: 'Relational databases, SQL, normalization, indexing, transactions, concurrency control',
          credits: 3,
          level: 'undergraduate',
          category: 'Computer Science',
        },
        {
          title: 'Software Engineering',
          institution: 'University of Waterloo',
          description: 'Software development methodologies and best practices',
          syllabus: 'Software lifecycle, requirements engineering, design patterns, testing, project management',
          credits: 3,
          level: 'undergraduate',
          category: 'Computer Science',
        },
        {
          title: 'Artificial Intelligence',
          institution: 'Georgia Tech',
          description: 'Core concepts and techniques in artificial intelligence',
          syllabus: 'Search algorithms, knowledge representation, expert systems, natural language processing',
          credits: 4,
          level: 'graduate',
          category: 'Artificial Intelligence',
        },
        {
          title: 'Computer Networks',
          institution: 'University of Illinois',
          description: 'Network protocols, architecture, and implementation',
          syllabus: 'OSI model, TCP/IP, routing, switching, network security, wireless networks',
          credits: 3,
          level: 'undergraduate',
          category: 'Computer Science',
        },
      ];

      if (this.developmentMode) {
        // Store courses in memory for development mode
        this.courseDatabase = courses;
        console.log(`✅ Loaded ${courses.length} courses into development database`);
      } else {
        // Create documents for vector store
        const documents = courses.map(course => 
          new Document({
            pageContent: `${course.title} - ${course.institution}\n\n${course.description}\n\nSyllabus: ${course.syllabus}\n\nCredits: ${course.credits}\nLevel: ${course.level}\nCategory: ${course.category}`,
            metadata: course,
          })
        );

        // Create vector store
        this.courseDatabase = await MemoryVectorStore.fromDocuments(
          documents,
          this.embeddings
        );

        console.log(`✅ Loaded ${courses.length} courses into vector database`);
      }
    } catch (error) {
      console.error('❌ Failed to load course database:', error);
      throw error;
    }
  }

  /**
   * Analyze course equivalency using AI
   */
  async analyzeCourseEquivalency(sourceCourse, targetInstitution) {
    try {
      if (!this.initialized) {
        throw new Error('AI service not initialized');
      }

      // Search for similar courses in the target institution
      const similarCourses = await this.courseDatabase.similaritySearch(
        sourceCourse,
        5,
        { institution: targetInstitution }
      );

      if (similarCourses.length === 0) {
        return {
          sourceCourse,
          targetCourse: null,
          confidenceScore: 0,
          verdict: 'not_equivalent',
          reasoning: 'No similar courses found at the target institution.',
          suggestedBridgingCourses: [],
        };
      }

      // Use OpenAI to analyze equivalency
      const analysisPrompt = `
        Analyze the equivalency between these courses:

        Source Course: ${sourceCourse}

        Target Institution: ${targetInstitution}

        Similar courses found:
        ${similarCourses.map((course, index) => 
          `${index + 1}. ${course.metadata.title} (${course.metadata.institution})
           Description: ${course.metadata.description}
           Syllabus: ${course.metadata.syllabus}
           Credits: ${course.metadata.credits}
           Level: ${course.metadata.level}
           Category: ${course.metadata.category}`
        ).join('\n\n')}

        Please provide:
        1. The best equivalent course from the list above
        2. A confidence score (0-100)
        3. A verdict: 'equivalent', 'partial', or 'not_equivalent'
        4. Detailed reasoning for your decision
        5. Suggested bridging courses if needed

        Respond in JSON format:
        {
          "targetCourse": "course title",
          "confidenceScore": number,
          "verdict": "equivalent|partial|not_equivalent",
          "reasoning": "detailed explanation",
          "suggestedBridgingCourses": ["course1", "course2"]
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: analysisPrompt }],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const analysis = JSON.parse(response.choices[0].message.content);

      return {
        sourceCourse,
        targetCourse: analysis.targetCourse,
        confidenceScore: analysis.confidenceScore,
        verdict: analysis.verdict,
        reasoning: analysis.reasoning,
        suggestedBridgingCourses: analysis.suggestedBridgingCourses || [],
      };
    } catch (error) {
      console.error('Error analyzing course equivalency:', error);
      throw error;
    }
  }

  /**
   * Analyze multiple courses for equivalency
   */
  async analyzeMultipleCourses(sourceCourses, targetInstitution) {
    try {
      const results = [];
      
      for (const course of sourceCourses) {
        const result = await this.analyzeCourseEquivalency(course, targetInstitution);
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Error analyzing multiple courses:', error);
      throw error;
    }
  }

  /**
   * Generate pathway suggestions based on user profile
   */
  async generatePathwaySuggestions(userProfile) {
    try {
      const prompt = `
        Based on the following user profile, suggest academic pathways:

        User Profile:
        - Completed Courses: ${userProfile.completedCourses?.join(', ') || 'None'}
        - Skills: ${userProfile.skills?.join(', ') || 'None'}
        - Interests: ${userProfile.interests?.join(', ') || 'None'}
        - Target Level: ${userProfile.targetLevel || 'undergraduate'}
        - Preferred Institutions: ${userProfile.preferredInstitutions?.join(', ') || 'Any'}

        Please suggest 3-5 academic pathways with:
        1. Pathway title and description
        2. Confidence level (0-100)
        3. Recommended courses
        4. Estimated timeline
        5. Career opportunities

        Respond in JSON format:
        {
          "pathways": [
            {
              "id": "unique_id",
              "title": "pathway title",
              "description": "detailed description",
              "confidence": number,
              "recommendedCourses": ["course1", "course2"],
              "timeline": "estimated timeline",
              "careerOpportunities": ["career1", "career2"]
            }
          ]
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const suggestions = JSON.parse(response.choices[0].message.content);
      return suggestions.pathways;
    } catch (error) {
      console.error('Error generating pathway suggestions:', error);
      throw error;
    }
  }

  /**
   * Analyze assessment results and provide recommendations
   */
  async analyzeAssessmentResults(assessmentData) {
    try {
      const prompt = `
        Analyze the following assessment results and provide recommendations:

        Assessment: ${assessmentData.title}
        Score: ${assessmentData.score}%
        Questions Answered: ${assessmentData.questionsAnswered}
        Time Taken: ${assessmentData.timeTaken} minutes
        Difficulty Level: ${assessmentData.difficultyLevel}

        Please provide:
        1. Skills identified based on performance
        2. Areas for improvement
        3. Recommended next steps
        4. Suggested courses or resources
        5. Confidence in recommendations (0-100)

        Respond in JSON format:
        {
          "skillsIdentified": ["skill1", "skill2"],
          "areasForImprovement": ["area1", "area2"],
          "recommendations": ["rec1", "rec2"],
          "suggestedCourses": ["course1", "course2"],
          "confidence": number
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 1000,
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      return analysis;
    } catch (error) {
      console.error('Error analyzing assessment results:', error);
      throw error;
    }
  }

  /**
   * Generate personalized learning recommendations
   */
  async generateLearningRecommendations(userProfile, learningGoals) {
    try {
      const prompt = `
        Generate personalized learning recommendations for:

        User Profile:
        - Current Level: ${userProfile.level}
        - Background: ${userProfile.background}
        - Skills: ${userProfile.skills?.join(', ')}
        - Learning Style: ${userProfile.learningStyle}

        Learning Goals:
        - Primary Goal: ${learningGoals.primary}
        - Timeline: ${learningGoals.timeline}
        - Preferred Format: ${learningGoals.format}

        Please provide:
        1. Recommended learning path
        2. Specific courses or resources
        3. Milestones and checkpoints
        4. Estimated time commitment
        5. Success metrics

        Respond in JSON format:
        {
          "learningPath": "detailed path description",
          "recommendedResources": ["resource1", "resource2"],
          "milestones": ["milestone1", "milestone2"],
          "timeCommitment": "estimated hours per week",
          "successMetrics": ["metric1", "metric2"]
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 1200,
      });

      const recommendations = JSON.parse(response.choices[0].message.content);
      return recommendations;
    } catch (error) {
      console.error('Error generating learning recommendations:', error);
      throw error;
    }
  }
}

// Create singleton instance
const aiService = new AIService();

module.exports = {
  aiService,
  initializeAI: () => aiService.initialize(),
}; 