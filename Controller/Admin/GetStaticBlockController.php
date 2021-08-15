<?php

/**
 * @copyright EveryWorkflow. All rights reserved.
 */

declare(strict_types=1);

namespace EveryWorkflow\StaticBlockBundle\Controller\Admin;

use EveryWorkflow\CoreBundle\Annotation\EWFRoute;
use EveryWorkflow\StaticBlockBundle\Form\StaticBlockFormInterface;
use EveryWorkflow\StaticBlockBundle\Repository\StaticBlockRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class GetStaticBlockController extends AbstractController
{
    protected StaticBlockFormInterface $staticBlockForm;
    protected StaticBlockRepositoryInterface $staticBlockRepository;

    public function __construct(
        StaticBlockFormInterface $staticBlockForm,
        StaticBlockRepositoryInterface $staticBlockRepository
    ) {
        $this->staticBlockForm = $staticBlockForm;
        $this->staticBlockRepository = $staticBlockRepository;
    }

    /**
     * @EWFRoute(
     *     admin_api_path="cms/static-block/{uuid}",
     *     defaults={"uuid"="create"},
     *     name="admin.cms.static_block.view",
     *     methods="GET"
     * )
     */
    public function __invoke(string $uuid, Request $request): JsonResponse
    {
        $data = [
            'data_form' => $this->staticBlockForm->toArray(),
        ];

        if ('create' !== $uuid) {
            try {
                $item = $this->staticBlockRepository->findById($uuid);
                $data['item'] = $item->toArray();
            } catch (\Exception $e) {
                // ignore if _id doesn't exist
            }
        }

        return (new JsonResponse())->setData($data);
    }
}
